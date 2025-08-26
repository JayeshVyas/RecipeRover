import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const budgetOptions = [
  "<$10,000",
  "$10,000-$30,000",
  "$30,000-$50,000",
  ">$50,000"
];

export default function BookCallModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    budget: budgetOptions[0]
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1200);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-3xl relative text-card-foreground p-0">
        <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition" onClick={onClose} aria-label="Close">✕</button>
        <div className="flex flex-col md:flex-row gap-0 md:gap-8">
          {/* Left: Form */}
          <form className="flex-1 p-8 flex flex-col gap-6 justify-center" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">First Name</label>
                <Input name="firstName" placeholder="Jane" value={form.firstName} onChange={handleChange} required className="bg-input text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">Last Name</label>
                <Input name="lastName" placeholder="Smith" value={form.lastName} onChange={handleChange} required className="bg-input text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <Input name="email" type="email" placeholder="jane@framer.com" value={form.email} onChange={handleChange} required className="bg-input text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Company Website</label>
              <Input name="website" placeholder="www.brandname.com" value={form.website} onChange={handleChange} className="bg-input text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Monthly Ad Budget</label>
              <select name="budget" className="w-full p-2 rounded-lg border border-border bg-input text-foreground" value={form.budget} onChange={handleChange} required>
                <option value="">Select...</option>
                {budgetOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground text-lg font-semibold py-3 rounded-lg" disabled={loading}>{loading ? "Booking..." : "Submit"}</Button>
          </form>
          {/* Right: Testimonial */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <div className="mb-4 text-base font-semibold">Here is what our partners say</div>
            <div className="bg-secondary rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                  {/* Avatar placeholder */}
                  <span className="text-2xl font-bold text-primary-foreground">WC</span>
                </div>
                <div>
                  <div className="text-sm font-bold">WILL CARIUS,</div>
                  <div className="text-xs font-medium text-muted-foreground">FOUNDER</div>
                </div>
              </div>
              <div className="mb-2 flex gap-2 items-center">
                <span className="text-xs font-bold tracking-wide">BARRISTER AND MANN</span>
                <span className="text-xs">×</span>
                <span className="text-xs font-bold tracking-wide">GoMarble</span>
              </div>
              <div className="text-base mt-2 text-card-foreground">
                “I’m incredibly pleased with the results. I’ve worked with multiple agencies, but only GoMarble has delivered profitable outcomes for Barrister and Mann, and they did it at a fraction of the cost!”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
