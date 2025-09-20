import { cn } from "@/lib/utils"
import type { Supplier } from "@/types/supplier";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Building2, FileText, Copy, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SupplierInfoCardProps {
  supplier: Supplier;
  className?: string;
}

export function SupplierInfoCard({
  supplier,
  className = "",
}: SupplierInfoCardProps) {
  const router = useRouter();

  const handleCopyEmail = () => {
    if (supplier.email) {
      navigator.clipboard.writeText(supplier.email);
    }
  };

  const handleCopyPhone = () => {
    if (supplier.contact_number) {
      navigator.clipboard.writeText(supplier.contact_number);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page (you can implement this later)
    console.log("Edit supplier:", supplier.id);
  };

  const handleDelete = () => {
    // Handle delete action (you can implement this later)
    console.log("Delete supplier:", supplier.id);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">{supplier.name}</CardTitle>
                  <CardDescription>Supplier ID: {supplier.id}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit">
                Active Supplier
              </Badge>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              {supplier.contact_number ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{supplier.contact_number}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyPhone}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-lg text-muted-foreground">
                  No phone number provided
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              {supplier.email ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{supplier.email}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyEmail}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-lg text-muted-foreground">
                  No email address provided
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplier.description ? (
              <p className="text-sm leading-relaxed">{supplier.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided for this supplier.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
