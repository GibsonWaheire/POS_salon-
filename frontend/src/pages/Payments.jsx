import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Payments() {
  const [payments] = useState([])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View payment history and transactions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payment transactions and records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>#{payment.appointment_id}</TableCell>
                    <TableCell>{payment.appointment?.customer?.name}</TableCell>
                    <TableCell className="font-medium">${payment.amount}</TableCell>
                    <TableCell>{payment.payment_method || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

