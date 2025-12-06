import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CrudRecords, fetchRecords, fetchSingleRecord } from '@/utils/airtableService';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/extension/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Loader, Calendar, MapPin, Users, Monitor, ArrowLeft, FileText, Plus, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

const eventSchema = z.object({
  Name: z.string().min(1, { message: 'Event Name is required' }),
  Date: z.string().min(1, { message: 'Event Date is required' }),
  Mode: z.enum(['Online', 'Offline', 'Both']),
  Venue: z.string().min(1, { message: 'Venue is required' }),
  Type: z.string().min(1, { message: 'Type is required' }),
  Description: z.string().min(1, { message: 'Description is required' }),
  Coordinators: z.array(z.string()).optional(),
  Attendees: z.array(z.string()).optional(),
  Volunteers: z.array(z.string()).optional(),
});

function EventForm() {
  const { id } = useParams();
  const [mode, setMode] = useState('create');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { toast } = useToast()
  const authContext = useAuth();
  const { user, role: userRole } = authContext || {};
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      Name: '',
      Date: '',
      Mode: '',
      Venue: '',
      Type: '',
      Description: '',
      Coordinators: [],
      Attendees: [],
      Volunteers: [],
    },
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (id) {
      setLoadingData(true);
      fetchEventData();
    }
  }, [id]);

  async function fetchEventData() {
    try {
      const Records = await fetchSingleRecord('Events', id);
      if (Records && Records.fields) {
        form.setValue('Name', Records.fields.Name || '');
        form.setValue('Date', Records.fields.Date || '');
        form.setValue('Mode', Records.fields.Mode || '');
        form.setValue('Venue', Records.fields.Venue || '');
        form.setValue('Type', Records.fields.Type || '');
        form.setValue('Description', Records.fields.Description || '');
        form.setValue('Coordinators', Records.fields.Coordinators || []);
        form.setValue('Attendees', Records.fields.Attendees || []);
        form.setValue('Volunteers', Records.fields.Volunteers || []);
      }
      setLoadingData(false);
      setEvent(Records);
      setMode('edit');
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  }

  async function fetchMembers() {
    try {
      setLoading(true);
      const membersData = await fetchRecords('Members', '', 'auto', 'desc');
      const membersList = membersData.map(member => ({
        id: member.id,
        name: member.fields.name,
        department: member.fields.department,
        batch: member.fields.Batch,
        uniqueId: member.fields.Unique_ID,
      }));
      setMembers(membersList);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      if (event && userRole !== 'admin') {
        if (event.fields.Created_by !== user?.displayName) {
          toast({
            title: 'Permission Denied',
            description: 'You are not allowed to update this event',
            variant: 'destructive',
          });
          setSubmitLoading(false);
          return;
        }
      }

      const bodyData = {
        fields: {
          ...data,
          Updated_by: user?.displayName || user.email,
        },
      };

      if (mode === 'create') {
        bodyData.fields.Created_by = user?.displayName || user.email;
        await CrudRecords('Events', 'POST', bodyData);
        toast({
          title: 'Event Created',
          description: 'Event has been created successfully',
          variant: 'success',
        });
        form.reset();
      } else if (mode === 'edit') {
        await fetchSingleRecord('Events', id, 'PATCH', bodyData);
        toast({
          title: 'Event Updated',
          description: 'Event has been updated successfully',
          variant: 'success',
        });
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const Types = [
    { value: 'Talk Session', label: 'Talk Session' },
    { value: 'Work shop', label: 'Workshop' },
    { value: 'Boot Camp', label: 'Boot Camp' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Learning Program', label: 'Learning Program' },
  ];

  const Modes = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
    { value: 'Both', label: 'Both' },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h1>
            <p className="text-gray-400">
              {mode === 'create' ? 'Plan and organize a new event' : 'Update event details and participants'}
            </p>
          </div>
        </div>

        <Card className="w-full shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <CardTitle className="text-2xl">
                {mode === 'create' ? 'New Event Planning' : 'Event Details'}
              </CardTitle>
            </div>
          </CardHeader>

          <Form {...form}>
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600">Loading event data...</span>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Details Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Event Information
                      </h3>

                      <FormField
                        control={form.control}
                        name="Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Event Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter event name"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Event Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Mode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                Mode
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50 border-gray-300">
                                    <SelectValue placeholder="Select mode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Modes.map((mode) => (
                                    <SelectItem key={mode.value} value={mode.value}>
                                      {mode.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="Type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Event Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50 border-gray-300">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Types.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="Venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Venue
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter venue location"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the event purpose, agenda, and details..."
                                {...field}
                                className="bg-gray-50 border-gray-300 min-h-[120px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a comprehensive description of the event
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Participants Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Participants
                      </h3>

                      <FormField
                        control={form.control}
                        name="Coordinators"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Coordinators</FormLabel>
                            <FormControl>
                              <MultiSelector
                                values={field.value}
                                onValuesChange={field.onChange}
                                loop={false}
                              >
                                <MultiSelectorTrigger className="bg-gray-50 border-gray-300">
                                  <MultiSelectorInput placeholder="Select coordinators" />
                                </MultiSelectorTrigger>
                                <MultiSelectorContent>
                                  <MultiSelectorList>
                                    {loading ? (
                                      <div className="p-4 text-center text-gray-500">
                                        <Loader className="w-4 h-4 animate-spin mx-auto" />
                                        <p className="text-sm mt-2">Loading members...</p>
                                      </div>
                                    ) : (
                                      members.map((member) => (
                                        <MultiSelectorItem key={member.id} value={member.id}>
                                          <div className="flex items-center justify-between w-full py-2">
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">{member.name}</span>
                                              <span className="text-xs text-gray-500">{member.department}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 px-2 bg-gray-100 rounded">
                                              {member.batch}
                                            </span>
                                          </div>
                                        </MultiSelectorItem>
                                      ))
                                    )}
                                  </MultiSelectorList>
                                </MultiSelectorContent>
                              </MultiSelector>
                            </FormControl>
                            <FormDescription>
                              Members responsible for organizing the event
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Volunteers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Volunteers</FormLabel>
                            <FormControl>
                              <MultiSelector
                                values={field.value}
                                onValuesChange={field.onChange}
                                loop={false}
                              >
                                <MultiSelectorTrigger className="bg-gray-50 border-gray-300">
                                  <MultiSelectorInput placeholder="Select volunteers" />
                                </MultiSelectorTrigger>
                                <MultiSelectorContent>
                                  <MultiSelectorList>
                                    {members.map((member) => (
                                      <MultiSelectorItem key={member.id} value={member.id}>
                                        <div className="flex items-center justify-between w-full py-2">
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{member.name}</span>
                                            <span className="text-xs text-gray-500">{member.department}</span>
                                          </div>
                                          <span className="text-xs text-gray-400 px-2 bg-gray-100 rounded">
                                            {member.batch}
                                          </span>
                                        </div>
                                      </MultiSelectorItem>
                                    ))}
                                  </MultiSelectorList>
                                </MultiSelectorContent>
                              </MultiSelector>
                            </FormControl>
                            <FormDescription>
                              Members assisting with event operations
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Attendees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Attendees</FormLabel>
                            <FormControl>
                              <MultiSelector
                                values={field.value}
                                onValuesChange={field.onChange}
                                loop={false}
                              >
                                <MultiSelectorTrigger className="bg-gray-50 border-gray-300">
                                  <MultiSelectorInput placeholder="Select attendees" />
                                </MultiSelectorTrigger>
                                <MultiSelectorContent>
                                  <MultiSelectorList>
                                    {members.map((member) => (
                                      <MultiSelectorItem key={member.id} value={member.id}>
                                        <div className="flex items-center justify-between w-full py-2">
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{member.name}</span>
                                            <span className="text-xs text-gray-500">{member.department}</span>
                                          </div>
                                          <span className="text-xs text-gray-400 px-2 bg-gray-100 rounded">
                                            {member.batch}
                                          </span>
                                        </div>
                                      </MultiSelectorItem>
                                    ))}
                                  </MultiSelectorList>
                                </MultiSelectorContent>
                              </MultiSelector>
                            </FormControl>
                            <FormDescription>
                              Members who will be attending the event
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 px-6 py-4 rounded-b-lg border-t">
                  <div className="flex gap-3 w-full justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      disabled={submitLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          {mode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          {mode === 'create' ? (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Event
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Update Event
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default EventForm;