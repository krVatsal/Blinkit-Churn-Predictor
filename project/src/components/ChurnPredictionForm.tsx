import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  CustomerAge: number;
  Sex: string;
  Tenure: number;
  ServiceUsageRate: number;
  SupportCalls: number;
  BillingDelay: number;
  PlanType: string;
  AgreementDuration: string;
  TotalExpenditure: number;
  RecentActivity: number;
}

export function ChurnPredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    CustomerAge: 0,
    Sex: "Male",
    Tenure: 0,
    ServiceUsageRate: 0,
    SupportCalls: 0,
    BillingDelay: 0,
    PlanType: "Standard",
    AgreementDuration: "Monthly",
    TotalExpenditure: 0,
    RecentActivity: 0,
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [possibleReasons, setPossibleReasons] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const transformedData = [
        Number(formData.CustomerAge),
        formData.Sex === "Male" ? 1 : 0,
        Number(formData.Tenure),
        Number(formData.ServiceUsageRate),
        Number(formData.SupportCalls),
        Number(formData.BillingDelay),
        formData.PlanType === "Premium" ? 1 : 0,
        formData.PlanType === "Standard" ? 1 : 0,
        formData.PlanType === "Basic" ? 1 : 0,
        formData.AgreementDuration === "Monthly" ? 1 : 0,
        formData.AgreementDuration === "Quarterly" ? 1 : 0,
        formData.AgreementDuration === "Annual" ? 1 : 0,
      ];

      const response = await fetch("https://blinkit-churn-predictor.onrender.com/predict", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: transformedData }),
      });
      
      if (!response.ok) throw new Error('Prediction failed');
      
      const data = await response.json();
      if (data.prediction === 1) {
        let reasons = [];
        if (formData.Tenure < 12) {
          reasons.push("Short tenure indicates less loyalty or satisfaction.");
        }
        if (formData.SupportCalls > 5) {
          reasons.push("High number of support calls may indicate unresolved issues.");
        }
        if (formData.BillingDelay > 0) {
          reasons.push("Billing delays suggest dissatisfaction with billing services.");
        }
  
        setPrediction("The customer is likely to churn");
        setPossibleReasons(reasons.join(" "));
      } else {
        setPrediction("The customer is likely to stay");
        setPossibleReasons("The customer shows satisfactory engagement and service usage.");
      }
     } catch (err) {
      setError("An error occurred while making the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className=" w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Customer Churn Prediction</CardTitle>
        <CardDescription>
          Enter customer details to predict the likelihood of churn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Customer Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.CustomerAge}
              onChange={(e) => handleChange("CustomerAge", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={formData.Sex}
              onValueChange={(value) => handleChange("Sex", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (months)</Label>
            <Input
              id="tenure"
              type="number"
              value={formData.Tenure}
              onChange={(e) => handleChange("Tenure", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage">Service Usage Rate</Label>
            <Input
              id="usage"
              type="number"
              value={formData.ServiceUsageRate}
              onChange={(e) => handleChange("ServiceUsageRate", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calls">Support Calls</Label>
            <Input
              id="calls"
              type="number"
              value={formData.SupportCalls}
              onChange={(e) => handleChange("SupportCalls", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing">Billing Delay</Label>
            <Input
              id="billing"
              type="number"
              value={formData.BillingDelay}
              onChange={(e) => handleChange("BillingDelay", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan Type</Label>
            <Select
              value={formData.PlanType}
              onValueChange={(value) => handleChange("PlanType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agreement">Agreement Duration</Label>
            <Select
              value={formData.AgreementDuration}
              onValueChange={(value) => handleChange("AgreementDuration", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenditure">Total Expenditure</Label>
            <Input
              id="expenditure"
              type="number"
              value={formData.TotalExpenditure}
              onChange={(e) => handleChange("TotalExpenditure", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Recent Activity</Label>
            <Input
              id="activity"
              type="number"
              value={formData.RecentActivity}
              onChange={(e) => handleChange("RecentActivity", parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              'Get Prediction'
            )}
          </Button>
        </div>

        {prediction !== null && (
          <Alert className={`mt-4 ${prediction=="The customer is likely to stay"? "bg-green-500/10 text-green-500 border-green-500/20": "bg-red-500/10 text-red-500 border-red-500/20"}`}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
             <b>Prediction Result: {prediction}</b> 
              <br />
             {possibleReasons}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}