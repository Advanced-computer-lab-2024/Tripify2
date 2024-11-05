'use client';
import { useCallback, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useOptimistic } from 'react';
import { ChevronDown, MessageSquarePlus, AlertCircle, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetcher } from '@/lib/fetch-client';
import { useSession } from 'next-auth/react';

const ComplaintsClient = ({ initialComplaints }) => {
  const router = useRouter();

  const formRef = useRef();

  const session = useSession()

  const [complaints, setComplaints] = useState(initialComplaints);
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isPending, startTransition] = useTransition();

  // Optimistic complaints state
  const [optimisticComplaints, addOptimisticComplaint] = useOptimistic(
    initialComplaints,
    (state, newComplaint) => [{ ...newComplaint, isPending: true }, ...state]
  );

//   const addOptimisticComplaint = useCallback((newComplaint) => {
//     setComplaints((prevComplaints) => [newComplaint, ...prevComplaints]);
//   }, []);

//   const filteredComplaints = useMemo(() => {
//       return optimisticComplaints
//             .filter(complaint => activeFilter === 'all' ? true : complaint.Status === activeFilter)
//             .sort((a, b) => {
//             return sortOrder === 'newest' 
//                 ? new Date(b.createdAt) - new Date(a.createdAt)
//                 : new Date(a.createdAt) - new Date(b.createdAt);
//             });
//   }, [optimisticComplaints, activeFilter, sortOrder]) 

//   console.log(optimisticComplaints)

  const handleSubmitComplaint = async (formData) => {
    startTransition(() => {
      setOpen(false);
    });
    // e.preventDefault();
    // setOpen(false);
    const optimisticComplaint = {
      _id: Date.now().toString(),
      UserId: session?.data?.user?.userId,
      Title: formData.get('title'),
      Body: formData.get('body'),
      Status: 'Pending',
      createdAt: new Date().toISOString(),
      Replies: [],
      isPending: true
    };

    addOptimisticComplaint(optimisticComplaint);

    try {
      const response = await fetcher('/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Title: formData.get('title'),
          Body: formData.get('body'),
          Status: 'Pending'
        }),
      });
      
      if (response.ok) {
        startTransition(() => {  
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Error:', error);
    //   setComplaints((prevComplaints) => 
    //     prevComplaints.filter(c => c._id !== optimisticComplaint._id)
    //   );
    }
  };

  const filteredComplaints = useMemo(() => {
    return optimisticComplaints
      .filter(complaint => activeFilter === 'all' ? true : complaint.Status === activeFilter)
      .sort((a, b) => {
        return sortOrder === 'newest' 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [optimisticComplaints, activeFilter, sortOrder]);

  const getStatusColor = (status) => {
    return status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200';
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-semibold text-gray-900">Complaints Portal</h1>
              <p className="mt-2 text-sm text-gray-500">
                Track and manage your complaints in one place
              </p>
            </div>
            <div className="flex mt-4 md:ml-4 md:mt-0">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="inline-flex items-center px-4 py-2">
                    <MessageSquarePlus className="w-5 h-5 mr-2" />
                    New Complaint
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Submit a New Complaint</DialogTitle>
                  </DialogHeader>
                  <form action={handleSubmitComplaint} ref={formRef} className="mt-4 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        name="title"
                        placeholder="Brief description of your complaint"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Details</label>
                      <Textarea
                        name="body"
                        placeholder="Provide all relevant details about your complaint..."
                        required
                        className="min-h-[150px] w-full"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      onClick={() => setOpen(false)}
                    //   disabled={isSubmitting}
                    >
                      {'Submit Complaint'}
                      {/* {isSubmitting ? 'Submitting...' : 'Submit Complaint'} */}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-3">
            <div className="flex space-x-2">
              {['all', 'Pending', 'Resolved'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    activeFilter === filter
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-700 bg-white border'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${
                sortOrder === 'oldest' ? 'rotate-180' : ''
              }`} />
              Sort by date: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No complaints found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new complaint.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all ${
                  complaint.isPending ? 'opacity-65 animate-pulse' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {complaint.UserId.UserName} ({complaint.UserId.Role})
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {complaint.Title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Submitted on {formatDate(complaint.createdAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.Status)} border`}>
                      {complaint.Status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 whitespace-pre-wrap">
                    {complaint.Body}
                  </p>
                  {complaint.Replies?.length > 0 && (
                    <div className="pt-4 mt-4 border-t">
                      <h4 className="mb-3 text-sm font-medium text-gray-900">
                        Admin Responses
                      </h4>
                      <div className="mt-2 space-y-4">
                        {complaint.Replies.map((reply, index) => (
                          <div 
                            key={index} 
                            className="p-4 border border-blue-100 rounded-lg bg-blue-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">
                                  {reply.UserId.UserName}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {reply.Reply}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    );
};

export default ComplaintsClient;