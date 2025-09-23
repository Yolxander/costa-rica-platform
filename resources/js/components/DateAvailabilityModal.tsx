import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CalendarEvent,
  type DateAvailability,
  type CalendarDateStatus,
} from '@/components/ui/calendar';
import {
  IconCalendar,
  IconX,
  IconCheck,
  IconClock,
  IconSettings,
  IconBan,
  IconPlus,
} from '@tabler/icons-react';

interface DateAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  currentAvailability: DateAvailability | null;
  onSave: (date: Date, availability: DateAvailability) => void;
  onRemove: (date: Date) => void;
}

export function DateAvailabilityModal({
  isOpen,
  onClose,
  selectedDate,
  currentAvailability,
  onSave,
  onRemove,
}: DateAvailabilityModalProps) {
  const [status, setStatus] = useState<DateAvailability['status']>(
    currentAvailability?.status || 'available'
  );
  const [reason, setReason] = useState(currentAvailability?.reason || '');

  const handleSave = () => {
    if (selectedDate) {
      onSave(selectedDate, {
        date: selectedDate,
        status,
        reason: reason.trim() || undefined,
      });
      onClose();
    }
  };

  const handleRemove = () => {
    if (selectedDate) {
      onRemove(selectedDate);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: DateAvailability['status']) => {
    switch (status) {
      case 'available':
        return <IconCheck className="h-4 w-4 text-green-600" />;
      case 'blocked':
        return <IconBan className="h-4 w-4 text-red-600" />;
      case 'pending-inquiry':
        return <IconClock className="h-4 w-4 text-blue-600" />;
      case 'maintenance':
        return <IconSettings className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: DateAvailability['status']) => {
    switch (status) {
      case 'available':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'blocked':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'pending-inquiry':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'maintenance':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
    }
  };

  if (!selectedDate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            <DialogTitle>Manage Date Availability</DialogTitle>
          </div>
          <DialogDescription>
            Configure availability settings for {formatDate(selectedDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status Display */}
          {currentAvailability && (
            <div className={`p-3 rounded-lg border ${getStatusColor(currentAvailability.status)}`}>
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon(currentAvailability.status)}
                <span className="font-medium">
                  Current Status: {currentAvailability.status.replace('-', ' ')}
                </span>
              </div>
              {currentAvailability.reason && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentAvailability.reason}
                </p>
              )}
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">Availability Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as DateAvailability['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">
                  <div className="flex items-center gap-2">
                    <IconCheck className="h-4 w-4 text-green-600" />
                    <span>Available</span>
                  </div>
                </SelectItem>
                <SelectItem value="blocked">
                  <div className="flex items-center gap-2">
                    <IconBan className="h-4 w-4 text-red-600" />
                    <span>Blocked</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending-inquiry">
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4 text-blue-600" />
                    <span>Pending Inquiry</span>
                  </div>
                </SelectItem>
                <SelectItem value="maintenance">
                  <div className="flex items-center gap-2">
                    <IconSettings className="h-4 w-4 text-orange-600" />
                    <span>Maintenance</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for this status..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Label>Quick Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus('blocked');
                  setReason('Blocked by host');
                }}
                className="text-red-600 hover:text-red-700"
              >
                <IconBan className="h-4 w-4 mr-1" />
                Block Date
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus('maintenance');
                  setReason('Property maintenance');
                }}
                className="text-orange-600 hover:text-orange-700"
              >
                <IconSettings className="h-4 w-4 mr-1" />
                Maintenance
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {currentAvailability && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              className="mr-auto"
            >
              <IconX className="h-4 w-4 mr-1" />
              Remove Status
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <IconCheck className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
