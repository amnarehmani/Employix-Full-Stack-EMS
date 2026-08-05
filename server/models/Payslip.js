import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    basicSalary: { type: Number, required: true, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    netPay: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['draft', 'paid'], default: 'draft' },
    paidAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: '' },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

payslipSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payslip', payslipSchema);
