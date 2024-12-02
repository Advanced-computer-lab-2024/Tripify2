'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { fetcher } from '../lib/fetch-client';

const NotificationContext = createContext();

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const session = useSession()

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  useEffect(() => {
    if (socket && session?.data?.user?.userId) {
      socket.emit('joinNotificationRoom', session?.data?.user?.userId);

      socket.on('newNotification', (notification) => {
        console.log("notifications", notification)
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      fetchNotifications();

      return () => {
        if (socket && session?.data?.user?.userId) {
            socket.emit('leaveNotificationRoom', session?.data?.user?.userId);
            socket.off('newNotification');
        }
      };
    }
  }, [socket, session?.data?.user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetcher('/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => n.Status === 'unread').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetcher(`/notifications/${notificationId}`, {
        method: 'PATCH'
      });
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, Status: 'read' } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}