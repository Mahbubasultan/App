'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { calculateShares, formatCurrency, SHARE_PRICE } from '@/lib/utils';

interface PaymentProofFormProps {
  nextPaymentDue: Date;
}

export const PaymentProofForm: React.FC<PaymentProofFormProps> = ({ nextPaymentDue }) => {
  const { success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    momoName: '',
    transactionId: '',
    amount: '',
  });
  const [preview, setPreview] = useState<string | null>(null);

  const amount = parseInt(formData.amount) || 0;
  const shares = calculateShares(amount);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    success('Success! Your payment is being verified.');
    setFormData({ momoName: '', transactionId: '', amount: '' });
    setPreview(null);
    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-black">Submit Payment Proof</h2>
        <p className="text-text-gray mt-1">Upload your mobile money payment screenshot</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name on MoMo"
          value={formData.momoName}
          onChange={(e) => setFormData({ ...formData, momoName: e.target.value })}
          placeholder="Enter name as shown on MoMo"
          required
        />
        
        <Input
          label="Transaction ID"
          value={formData.transactionId}
          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          placeholder="e.g., MTN-2024-001234"
          required
        />
        
        <Input
          label="Amount (RWF)"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="50,000"
          required
          min="2000"
        />

        {/* Share Calculation */}
        {amount >= 2000 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-gray mb-1">You will receive</p>
                <p className="text-3xl font-bold text-primary">{shares} shares</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-gray mb-1">Total Value</p>
                <p className="text-xl font-semibold text-text-black">{formatCurrency(amount)}</p>
              </div>
            </div>
            <p className="text-xs text-text-gray mt-3">
              {formatCurrency(amount)} ÷ {formatCurrency(SHARE_PRICE)} = {shares} shares
            </p>
          </div>
        )}
        
        {/* Large Upload Area */}
        <div>
          <label className="block text-sm font-medium text-text-black mb-3">
            Payment Screenshot
          </label>
          
          {!preview ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer 
                transition-all duration-200
                ${isDragActive 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-gray-300 hover:border-primary hover:bg-background-gray'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-4 text-text-gray" size={64} strokeWidth={1.5} />
              <p className="text-lg font-medium text-text-black mb-2">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your screenshot'}
              </p>
              <p className="text-sm text-text-gray mb-4">or click to browse</p>
              <p className="text-xs text-text-gray">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                <Image 
                  src={preview} 
                  alt="Payment preview" 
                  width={800}
                  height={320}
                  className="w-full h-80 object-contain bg-background-gray" 
                />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-medium hover:bg-background-gray transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-secondary">
                <CheckCircle size={16} />
                <span className="font-medium">Screenshot uploaded</span>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!preview || amount < 2000}
        >
          Submit Payment
        </Button>
      </form>
    </Card>
  );
};
