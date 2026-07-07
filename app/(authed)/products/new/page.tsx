import { Package } from 'lucide-react';
import { NewProductForm } from './new-product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">নতুন প্রোডাক্ট</h1>
          <p className="text-sm text-muted-foreground bangla">AI Writer এ এই product দিয়ে content generate করতে পারবেন</p>
        </div>
      </div>
      <NewProductForm />
    </div>
  );
}