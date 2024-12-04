'use client'
import React from 'react';
import { useNotification } from '../../providers/NotificationProvider';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    case 'warning':
      return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
    case 'error':
      return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    default:
      return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
  }
};

const NotificationCard = ({ notification, onClick }) => {
  const timeAgo = format(new Date(notification.createdAt), 'MMM d, h:mm a');

  return (
    <Card
      className={`cursor-pointer transition-colors ${notification.Status === 'unread' ? 'bg-muted/50' : ''
        }`}
      onClick={() => onClick(notification)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <NotificationIcon type={notification.Type} />
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-tight">{notification.Message}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead } = useNotification();
  const router = useRouter();

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);
    if (notification.TargetRoute) {
      router.push(notification.TargetRoute);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute flex items-center justify-center w-5 h-5 p-0 rounded-full -top-1 -right-1"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] min-h-[250px]">
          {notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
              <Bell className="h-12 w-12 stroke-[0.5px] mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="grid gap-1 p-1">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;