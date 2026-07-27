import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";

const STATUS_TEMPLATES = [
  { id: "in_transit", label: "In Transit", color: "#06B6D4" },
  { id: "out_for_delivery", label: "Out for Delivery", color: "#3B82F6" },
  { id: "delivered", label: "Delivered", color: "#22C55E" },
  { id: "delayed", label: "Delayed", color: "#F59E0B" },
];

const CONTACT_TEMPLATES = [
  {
    id: "customs_hold",
    label: "Customs Hold",
    color: "#F97316",
    reason: "Missing customs document",
  },
  {
    id: "fees_pending",
    label: "Fees Pending",
    color: "#D97706",
    reason: "Unpaid customs fees",
  },
  {
    id: "lost",
    label: "Lost",
    color: "#EF4444",
    reason: "Package not found",
  },
];

const DISPUTE_TEMPLATES = [
  { id: "dispute_opened", label: "Dispute opened" },
  { id: "dispute_resolved", label: "Dispute resolved" },
];

function EmailPreview({
  statusLabel,
  color,
  reason,
  showContact,
}: {
  statusLabel: string;
  color: string;
  reason?: string;
  showContact?: boolean;
}) {
  const adminPhone = "+237 6XX XXX XXX";
  const adminTelegram = "+237 6XX XXX XXX";
  const trackingNumber = "TC-DEMO-001";

  return (
    <div className="max-w-[600px] mx-auto my-8 shadow-xl rounded-xl overflow-hidden">
      <div
        className="text-white p-6 text-center"
        style={{ backgroundColor: "#1e293b" }}
      >
        <h1 className="text-xl font-bold m-0">Your Package Update</h1>
      </div>
      <div className="bg-white p-6 border-x border-b rounded-b-xl">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1e293b" }}>
          Package #{trackingNumber}
        </h2>
        <div
          className="p-3 text-center rounded-lg mb-4"
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}`,
          }}
        >
          <p className="text-lg font-bold m-0" style={{ color }}>
            New status: {statusLabel}
          </p>
        </div>
        {reason && (
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Reason: {reason}
          </p>
        )}
        {showContact && (
          <div
            className="p-4 my-4 rounded-lg"
            style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #f59e0b",
            }}
          >
            <p className="font-semibold m-0 mb-2">
              Contact our support team:
            </p>
            <p className="m-1"> WhatsApp : {adminPhone}</p>
            <p className="m-1"> Telegram : {adminTelegram}</p>
          </div>
        )}
        <p className="text-xs mt-4" style={{ color: "#6b7280" }}>
          Track your package in real time on your dashboard.
        </p>
        <hr className="my-4" style={{ borderColor: "#e5e7eb" }} />
        <p
          className="text-xs text-center m-0"
          style={{ color: "#9ca3af" }}
        >
          Track-Connect — Package Tracking Platform
        </p>
      </div>
    </div>
  );
}

function DisputeEmailPreview({ type }: { type: string }) {
  const trackingNumber = "TC-DEMO-001";

  return (
    <div className="max-w-[600px] mx-auto my-8 shadow-xl rounded-xl overflow-hidden">
      <div
        className="text-white p-6 text-center"
        style={{ backgroundColor: "#1e293b" }}
      >
        <h1 className="text-xl font-bold m-0">
          {type === "opened" ? "Dispute Opened" : "Dispute Resolved"}
        </h1>
      </div>
      <div className="bg-white p-6 border-x border-b rounded-b-xl">
        <p>
          {type === "opened"
            ? `A dispute has been opened for package ${trackingNumber}.`
            : `The dispute for package ${trackingNumber} has been resolved.`}
        </p>
        {type === "resolved" && (
          <div
            className="p-3 my-3 rounded-lg"
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #22c55e",
            }}
          >
            <p className="font-semibold m-0 mb-1">Team response:</p>
            <p className="m-0" style={{ color: "#374151" }}>
              We have resolved your dispute. A refund has been processed.
            </p>
          </div>
        )}
        <hr className="my-4" style={{ borderColor: "#e5e7eb" }} />
        <p className="text-xs text-center m-0" style={{ color: "#9ca3af" }}>
          Track-Connect
        </p>
      </div>
    </div>
  );
}

export default function EmailPreviewPage() {
  const [tab, setTab] = useState("status");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Email Previews</h1>
        <p className="text-muted-foreground mb-8">
          Preview of email templates sent to clients.
        </p>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="status">Status Changes</TabsTrigger>
            <TabsTrigger value="contact">With Support Contact</TabsTrigger>
            <TabsTrigger value="dispute">Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <div className="space-y-4">
              {STATUS_TEMPLATES.map((tpl) => (
                <Card key={tpl.id} className="p-4">
                  <h3 className="font-semibold mb-4">
                    Email: {tpl.label}
                  </h3>
                  <EmailPreview
                    statusLabel={tpl.label}
                    color={tpl.color}
                  />
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="space-y-4">
              {CONTACT_TEMPLATES.map((tpl) => (
                <Card key={tpl.id} className="p-4">
                  <h3 className="font-semibold mb-4">
                    Email: {tpl.label}
                  </h3>
                  <EmailPreview
                    statusLabel={tpl.label}
                    color={tpl.color}
                    reason={tpl.reason}
                    showContact
                  />
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dispute">
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  Email: Dispute Opened
                </h3>
                <DisputeEmailPreview type="opened" />
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  Email: Dispute Resolved
                </h3>
                <DisputeEmailPreview type="resolved" />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
