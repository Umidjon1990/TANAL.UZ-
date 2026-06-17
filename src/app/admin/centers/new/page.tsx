import { createCenterAction } from "@/app/actions";
import { CenterForm } from "@/components/center-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCenterPage() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Yangi test markazi</CardTitle>
      </CardHeader>
      <CardContent>
        <CenterForm action={createCenterAction} submitLabel="Markaz yaratish" />
      </CardContent>
    </Card>
  );
}
