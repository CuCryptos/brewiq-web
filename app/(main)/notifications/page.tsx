"use client";

import Link from "next/link";
import { Bell, Check, Camera, Heart, UserPlus, Trophy, GitFork, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { PageLoader } from "@/components/ui/Spinner";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Notification, NotificationType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  scan_complete: <Camera className="h-5 w-5 text-blue-500" />,
  review_liked: <Heart className="h-5 w-5 text-red-500" />,
  new_follower: <UserPlus className="h-5 w-5 text-purple-500" />,
  sighting_confirmed: <Check className="h-5 w-5 text-green-500" />,
  achievement_unlocked: <Trophy className="h-5 w-5 text-amber" />,
  recipe_forked: <GitFork className="h-5 w-5 text-orange-500" />,
  level_up: <Star className="h-5 w-5 text-yellow-500" />,
};

const notificationUrls: Record<NotificationType, string | null> = {
  scan_complete: "/scan",
  review_liked: "/profile",
  new_follower: "/profile",
  achievement_unlocked: "/achievements",
  recipe_forked: "/recipes",
  sighting_confirmed: "/sightings",
  level_up: "/profile",
};

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const url = notificationUrls[notification.type] ?? null;

  const content = (
    <>
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {notificationIcons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg transition-colors",
        notification.isRead ? "bg-transparent" : "bg-amber/5"
      )}
      {...(!url ? { role: "article" } : {})}
      aria-label={notification.title}
    >
      {url ? (
        <Link href={url} className="flex items-start gap-3 flex-1 min-w-0">
          {content}
        </Link>
      ) : (
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {content}
        </div>
      )}
      {!notification.isRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="text-xs text-amber hover:underline shrink-0"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => usersApi.getNotifications(1, 50),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => usersApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => usersApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (authLoading) {
    return <PageLoader message="Loading notifications..." />;
  }

  const notifications = notificationsData?.data || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            isLoading={markAllReadMutation.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="You're all caught up! Notifications will appear here."
        />
      ) : (
        <Card padding="none" className="divide-y divide-border overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markReadMutation.mutate(id)}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
