'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fetcher } from "@/lib/fetch-client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PromoCodeManagement({ initialPromoCodes = [] }) {
    const [promoCodes, setPromoCodes] = useState(initialPromoCodes);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingPromoCode, setEditingPromoCode] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [promoToDelete, setPromoToDelete] = useState(null);

    const defaultFormData = {
        Code: '',
        Type: 'percentage',
        Value: '',
        ApplicableToAll: true,
        EligibleUsers: []
    };

    const [formData, setFormData] = useState(defaultFormData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (editingPromoCode) {
                response = await fetcher(`/promo-codes/${editingPromoCode._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetcher('/promo-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                const data = await response.json();
                if (editingPromoCode) {
                    setPromoCodes(promoCodes.map(code =>
                        code._id === editingPromoCode._id ? data : code
                    ));
                } else {
                    setPromoCodes([...promoCodes, data]);
                }
                setOpen(false);
                setFormData(defaultFormData);
                setEditingPromoCode(null);
            }
        } catch (error) {
            console.error('Error saving promo code:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (promoCode) => {
        setEditingPromoCode(promoCode);
        setFormData({
            Code: promoCode.Code,
            Type: promoCode.Type,
            Value: promoCode.Value,
            ApplicableToAll: promoCode.ApplicableToAll,
            EligibleUsers: promoCode.EligibleUsers
        });
        setOpen(true);
    };

    const handleDelete = async (promoCode) => {
        try {
            const response = await fetcher(`/promo-codes/${promoCode._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPromoCodes(promoCodes.filter(code => code._id !== promoCode._id));
                setDeleteDialogOpen(false);
                setPromoToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting promo code:', error);
        }
    };

    const openDeleteDialog = (promoCode) => {
        setPromoToDelete(promoCode);
        setDeleteDialogOpen(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Dialog
                    open={open}
                    onOpenChange={(newOpen) => {
                        if (!newOpen) {
                            setFormData(defaultFormData);
                            setEditingPromoCode(null);
                        }
                        setOpen(newOpen);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="h-8 gap-1 ml-auto"
                        >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Promo Code
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingPromoCode ? 'Edit Promo Code' : 'Create New Promo Code'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingPromoCode ? 'Modify existing promo code' : 'Add a new promo code to the system'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={formData.Code}
                                    onChange={(e) => setFormData({ ...formData, Code: e.target.value })}
                                    placeholder="SUMMER2024"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Discount Type</Label>
                                <RadioGroup
                                    value={formData.Type}
                                    onValueChange={(value) => setFormData({ ...formData, Type: value })}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="percentage" id="percentage" />
                                        <Label htmlFor="percentage">Percentage</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fixed" id="fixed" />
                                        <Label htmlFor="fixed">Fixed Amount</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="value">Value</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={formData.Value}
                                    onChange={(e) => setFormData({ ...formData, Value: e.target.value })}
                                    placeholder={formData.Type === 'percentage' ? '10' : '100'}
                                    required
                                />
                            </div>

                            <Button disabled={loading} type="submit" className="flex items-center justify-center w-full gap-1">
                                {loading && <Loader2 size={16} className='animate-spin' />}
                                {editingPromoCode ? 'Update' : 'Create'} Promo Code
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Promo Codes</CardTitle>
                    <CardDescription>
                        Manage all promo codes in the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Applicable To</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promoCodes.map((promoCode) => (
                                <TableRow key={promoCode._id}>
                                    <TableCell>{promoCode.Code}</TableCell>
                                    <TableCell>{promoCode.Type}</TableCell>
                                    <TableCell>
                                        {promoCode.Type === 'percentage'
                                            ? `${promoCode.Value}%`
                                            : `$${promoCode.Value}`}
                                    </TableCell>
                                    <TableCell>
                                        {promoCode.ApplicableToAll ? 'All Users' : 'Selected Users'}
                                    </TableCell>
                                    <TableCell className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(promoCode)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => openDeleteDialog(promoCode)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the promo code "{promoToDelete?.Code}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPromoToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(promoToDelete)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}