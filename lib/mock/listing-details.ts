import type { Listing } from "@/lib/types/listing";

type ListingDetailFields = Pick<
  Listing,
  "description" | "images" | "owner"
>;

export const LISTING_DETAILS: Record<string, ListingDetailFields> = {
  "lst-001": {
    description:
      "Quiet single rooms with steady water supply and security at the gate. Popular with engineering students walking to South Gate lectures.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Adebayo",
      phone: "+2348012345678",
      responseLabel: "Usually responds within 2 hours",
    },
  },
  "lst-002": {
    description:
      "Spacious self-contain units with private kitchenette and backup generator. Ideal if you want more privacy near South Gate.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    owner: {
      name: "Mrs. Ogunleye",
      phone: "+2348023456789",
      responseLabel: "Usually responds within 1 hour",
    },
  },
  "lst-003": {
    description:
      "Affordable shared rooms close to North Gate. Clean compound with on-site security and borehole water.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1574643150339-04e90be74463?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Chukwu",
      phone: "+2348034567890",
    },
  },
  "lst-004": {
    description:
      "Budget-friendly lodge in Ibule for students who prefer a calmer area away from the main gate traffic.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Ibrahim",
      phone: "+2348045678901",
      responseLabel: "Usually responds within 4 hours",
    },
  },
  "lst-005": {
    description:
      "Premium self-contain in Ibule with WiFi, kitchen, and generator. Good for students who study late.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
    ],
    owner: {
      name: "Mrs. Fasanya",
      phone: "+2348056789012",
      responseLabel: "Usually responds within 1 hour",
    },
  },
  "lst-006": {
    description:
      "Homely lodge in Apatapiti with shared facilities and a friendly compound atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Tunde",
      phone: "+2348067890123",
    },
  },
  "lst-007": {
    description:
      "Executive flat on Ondo Road with parking and generator. Best for students with transport or postgraduate residents.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Okon",
      phone: "+2348078901234",
      responseLabel: "Usually responds within 3 hours",
    },
  },
  "lst-008": {
    description:
      "Hostel-style rooms at the edge of FUTA Community. Short walk to campus facilities.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    owner: {
      name: "Mrs. Eze",
      phone: "+2348089012345",
    },
  },
  "lst-009": {
    description:
      "Low-cost option in Akure Township for students comfortable commuting to FUTA daily.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Bello",
      phone: "+2348090123456",
    },
  },
  "lst-010": {
    description:
      "Premium self-contain near South Gate with AC, kitchen, and fast WiFi. One of the most requested listings in the area.",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Praise Properties",
      phone: "+2348101234567",
      responseLabel: "Usually responds within 30 minutes",
    },
  },
  "lst-011": {
    description:
      "Single rooms at North Gate with generator backup and 24-hour security. Close to lecture halls.",
    images: [
      "https://images.unsplash.com/photo-1574643150339-04e90be74463?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    owner: {
      name: "Mrs. Akintola",
      phone: "+2348112345678",
    },
  },
  "lst-012": {
    description:
      "Garden lodge in Ibule with borehole water and shared compound space. Good value for 2-in-a-room.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    ],
    owner: {
      name: "Mr. Segun",
      phone: "+2348123456789",
      responseLabel: "Usually responds within 2 hours",
    },
  },
};
