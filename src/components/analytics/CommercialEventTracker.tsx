"use client";

import { useEffect } from "react";
import { trackCommercialEvent, type CommercialEventName } from "@/lib/commercial-analytics";

type CommercialEventTrackerProps = {
  eventName: CommercialEventName;
  equipmentId?: string;
  searchQuery?: string;
  city?: string;
  category?: string;
  resultCount?: number;
  pagePath?: string;
};

export function CommercialEventTracker(props: CommercialEventTrackerProps) {
  const { eventName, equipmentId, searchQuery, city, category, resultCount, pagePath } = props;

  useEffect(() => {
    trackCommercialEvent(eventName, { equipmentId, searchQuery, city, category, resultCount, pagePath });
  }, [category, city, equipmentId, eventName, pagePath, resultCount, searchQuery]);

  return null;
}
