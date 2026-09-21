"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  House,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const payments = [
  { month: "September 2026", reference: "HSP-9X41KC", date: "2 Sep 2026", amount: 51500, status: "Paid" },
  { month: "August 2026", reference: "HSP-8N20QA", date: "1 Aug 2026", amount: 51500, status: "Paid" },
  { month: "July 2026", reference: "HSP-7M18RE", date: "3 Jul 2026", amount: 51500, status: "Paid" },
];

export function RentalDashboard() {
  const [payOpen, setPayOpen] = useState(false);
  const [phone, setPhone] = useState("0712 345 678");

  const requestPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPayOpen(false);
    toast.success("M-PESA request sent", {
      description: `Check ${phone} and enter your M-PESA PIN to complete KSh 51,500.`,
    });
  };

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[1.8rem] bg-[#123b38] text-white">
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#91d5c6]">
              <House className="h-4 w-4" /> My rental
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Everything about your home, in one calm place.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#cfe3dd]">Track rent, receipts, lease details, and communication for Unit 402 at Jacaranda Court.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">Kilimani, Nairobi</span>
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">Lease ends 31 Jan 2027</span>
              <span className="flex items-center gap-1 rounded-full bg-[#dff7ed] px-3 py-2 text-[#126353]"><BadgeCheck className="h-4 w-4" /> Active tenancy</span>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white p-5 text-[#173f3b] shadow-xl sm:p-6">
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#71817d]">October rent</span><CalendarDays className="h-5 w-5 text-[#e18356]" /></div>
            <div className="mt-4 text-4xl font-extrabold tracking-[-0.05em]">KSh 51,500</div>
            <p className="mt-2 text-sm text-[#687b76]">KSh 48,000 rent + KSh 3,500 service charge</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9efec]"><div className="h-full w-4/5 rounded-full bg-[#e18356]" /></div>
            <div className="mt-2 flex justify-between text-xs"><span className="font-semibold text-[#b56642]">Due in 5 days</span><span className="text-[#71817d]">5 Oct 2026</span></div>
            <Button onClick={() => setPayOpen(true)} className="mt-5 h-12 w-full rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]"><Smartphone className="mr-2 h-4 w-4" />Pay securely with M-PESA</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Monthly rent", value: "KSh 48,000", icon: Banknote, tone: "bg-[#e5f2ee] text-[#0f766e]" },
          { label: "Deposit held", value: "KSh 48,000", icon: ShieldCheck, tone: "bg-[#faeddf] text-[#b56642]" },
          { label: "Lease remaining", value: "4 months", icon: FileText, tone: "bg-[#e8eef7] text-[#47658a]" },
          { label: "Payment streak", value: "8 on time", icon: CheckCircle2, tone: "bg-[#edf4e5] text-[#577735]" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-[1.35rem] border border-[#dfe8e5] bg-white p-4">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
            <div className="mt-4 text-xl font-extrabold tracking-[-0.03em] text-[#173f3b]">{value}</div>
            <div className="mt-1 text-xs text-[#71817d]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[1.6rem] border border-[#dfe8e5] bg-white">
          <div className="flex items-center justify-between border-b border-[#e5ece9] p-5"><div><h2 className="font-bold text-[#173f3b]">Payment history</h2><p className="mt-1 text-xs text-[#71817d]">Receipts are issued after confirmed settlement</p></div><ReceiptText className="h-5 w-5 text-[#0f766e]" /></div>
          <div className="divide-y divide-[#edf1ef]">
            {payments.map((payment) => (
              <div key={payment.reference} className="flex items-center gap-3 p-4 sm:p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e9f4f0] text-[#0f766e]"><CheckCircle2 className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1"><b className="block truncate text-sm text-[#173f3b]">{payment.month}</b><span className="text-xs text-[#71817d]">{payment.date} · {payment.reference}</span></div>
                <div className="text-right"><b className="block text-sm text-[#173f3b]">KSh {payment.amount.toLocaleString()}</b><span className="text-xs font-bold text-[#087052]">{payment.status}</span></div>
                <button onClick={() => toast.success(`${payment.month} receipt ready`)} aria-label={`Download ${payment.month} receipt`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#dce7e3] text-[#60746f]"><Download className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="px-1 font-bold text-[#173f3b]">Rental shortcuts</h2>
          {[
            { title: "Lease agreement", detail: "Signed 1 Feb 2026", icon: FileText },
            { title: "Contact property manager", detail: "Wanjiku · usually replies quickly", icon: Building2 },
            { title: "Statements & receipts", detail: "8 payment records", icon: WalletCards },
          ].map(({ title, detail, icon: Icon }) => (
            <button key={title} onClick={() => toast(`${title} opened`)} className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[#dfe8e5] bg-white p-4 text-left transition hover:border-[#bcd6ce] hover:bg-[#f8fbf9]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0f5f3] text-[#0f766e]"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><b className="block text-sm text-[#173f3b]">{title}</b><span className="block truncate text-xs text-[#71817d]">{detail}</span></div><ChevronRight className="h-5 w-5 text-[#82918d]" />
            </button>
          ))}
          <div className="rounded-[1.2rem] bg-[#faf6eb] p-4 text-xs leading-5 text-[#725f45]"><b className="block text-sm text-[#604c33]">Payment safety</b>HomeSpot never asks for your M-PESA PIN. Confirm the recipient and amount in the M-PESA prompt before paying.</div>
        </div>
      </div>

      {payOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-end bg-[#0e302d]/55 sm:place-items-center sm:p-5">
          <form onSubmit={requestPayment} className="w-full rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-[2rem]">
            <div className="flex items-start justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">Secure checkout</div><h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#173f3b]">Pay KSh 51,500</h2></div><button type="button" onClick={() => setPayOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f5f3] text-[#4f6761]"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 rounded-xl bg-[#f2f7f5] p-4 text-sm"><div className="flex justify-between"><span className="text-[#687b76]">Home</span><b className="text-[#173f3b]">Jacaranda Court · 402</b></div><div className="mt-2 flex justify-between"><span className="text-[#687b76]">For</span><b className="text-[#173f3b]">October 2026</b></div></div>
            <label className="mt-5 block text-xs font-bold text-[#47635d]">M-PESA phone number<input required value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" className="mt-2 h-12 w-full rounded-xl border border-[#cfddd8] px-4 text-base outline-none focus:border-[#0f766e]" /></label>
            <Button className="mt-5 h-12 w-full rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]"><Smartphone className="mr-2 h-4 w-4" />Send M-PESA prompt</Button>
            <p className="mt-3 text-center text-[11px] leading-4 text-[#71817d]">This preview prepares the payment request. A payment is only recorded after provider confirmation.</p>
          </form>
        </div>
      )}
    </section>
  );
}
