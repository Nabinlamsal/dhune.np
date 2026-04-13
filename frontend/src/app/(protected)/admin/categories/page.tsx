"use client";

import { useState } from "react";
import { Layers3, Plus, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { Input } from "@/src/components/ui/input";

import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeactivateCategory,
    useDeleteCategory,
    useReactivateCategory
} from "@/src/hooks/catalog/useCategory";
import { Category } from "@/src/types/catalog/category";
import { PricingUnit } from "@/src/types/catalog/category-enums";

export default function AdminCategoriesPage() {
    const { data, isLoading } = useCategories();

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deactivateMutation = useDeactivateCategory();
    const reactivateMutation = useReactivateCategory();
    const deleteCategory = useDeleteCategory();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const PRICING_UNITS: PricingUnit[] = ["KG", "SQFT", "ITEMS"];
    const [units, setUnits] = useState<PricingUnit[]>([]);
    const categories = data ?? [];
    const activeCount = categories.filter((category) => category.is_active).length;
    const inactiveCount = categories.length - activeCount;

    const resetForm = () => {
        setName("");
        setDescription("");
        setUnits([]);
        setEditing(null);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        if (editing) {
            await updateMutation.mutateAsync({
                id: editing.id,
                name,
                description,
                allowed_units: units,
            });
        } else {
            await createMutation.mutateAsync({
                name,
                description,
                allowed_units: units,
            });
        }

        resetForm();
        setOpen(false);
    };

    const columns = [
        {
            key: "name",
            header: "Category Name",
            render: (c: Category) => (
                <div>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        {c.id}
                    </div>
                </div>
            ),
        },
        {
            key: "description",
            header: "Description",
            render: (c: Category) => (
                <span className="text-sm leading-6 text-slate-600">
                    {c.description || "No description added"}
                </span>
            ),
        },
        {
            key: "allowed_units",
            header: "Allowed Units",
            render: (c: Category) => (
                <div className="flex flex-wrap gap-2">
                    {c.allowed_units.map((unit) => (
                        <span
                            key={unit}
                            className="rounded-full border border-[#040947]/10 bg-[#040947]/5 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#040947]"
                        >
                            {unit}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: "is_active",
            header: "Status",
            render: (c: Category) =>
                c.is_active ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        Inactive
                    </span>
                ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (c: Category) => (
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                            setEditing(c);
                            setName(c.name);
                            setDescription(c.description || "");
                            setUnits(c.allowed_units);
                            setOpen(true);
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete "${c.name}"?`)) {
                                deleteCategory.mutate(c.id);
                            }
                        }}
                    >
                        Delete
                    </Button>

                    {c.is_active ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                            onClick={() => deactivateMutation.mutate(c.id)}
                        >
                            Deactivate
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-[#040947] text-white hover:bg-[#030736]"
                            onClick={() => reactivateMutation.mutate(c.id)}
                        >
                            Reactivate
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 bg-[#f5f1e8] p-1">
            <div className="overflow-hidden rounded-[28px] border border-[#d8d0bf] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(245,241,232,0.98)_56%,_rgba(232,224,208,0.9))] shadow-[0_20px_50px_rgba(54,42,20,0.08)]">
                <div className="flex flex-col gap-6 border-b border-[#d8d0bf] px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#cfc4ae] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4e4434]">
                            <Layers3 className="size-3.5" />
                            Admin Catalog
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl text-[#2f2618]">
                                Category Management
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#6d624e]">
                                Maintain service categories, define how pricing works, and keep the catalog readable for both operations and vendors.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            resetForm();
                            setOpen(true);
                        }}
                        className="h-11 rounded-full bg-[#2f2618] px-5 text-white hover:bg-[#211a11]"
                    >
                        <Plus className="mr-2 size-4" />
                        Create Category
                    </Button>
                </div>

                <div className="grid gap-4 px-6 py-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#d8d0bf] bg-white/75 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c705b]">
                            Total Categories
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#2f2618]">{categories.length}</p>
                    </div>
                    <div className="rounded-2xl border border-[#d8d0bf] bg-white/75 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c705b]">
                            Active
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-emerald-700">{activeCount}</p>
                    </div>
                    <div className="rounded-2xl border border-[#d8d0bf] bg-white/75 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c705b]">
                            Needs Review
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#8a6a3f]">{inactiveCount}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#d8d0bf] bg-white shadow-[0_18px_40px_rgba(54,42,20,0.06)]">
                <div className="flex items-center justify-between border-b border-[#ece5d6] px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-[#2f2618]">Catalog Categories</h3>
                        <p className="text-sm text-[#7a6f5e]">
                            Clean, structured, and ready for pricing operations.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f0e5] px-3 py-1 text-xs font-medium text-[#6d624e]">
                        <Sparkles className="size-3.5" />
                        Design refreshed
                    </div>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <p className="text-sm text-[#7a6f5e]">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-sm text-[#7a6f5e]">No categories found</p>
                    ) : (
                        <DataTable columns={columns} data={categories} />
                    )}
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20160c]/45 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-[#d8d0bf] bg-[#fcfaf5] shadow-[0_24px_60px_rgba(32,22,12,0.22)]">
                        <div className="border-b border-[#e8dfd0] px-6 py-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7f6c]">
                                Category Editor
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold text-[#2f2618]">
                                {editing ? "Edit Category" : "Create Category"}
                            </h3>
                        </div>

                        <div className="space-y-5 px-6 py-6">
                            <Input
                                placeholder="Category name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 border-[#d8d0bf] bg-white text-slate-800 placeholder:text-slate-400"
                            />

                            <Input
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-12 border-[#d8d0bf] bg-white text-slate-800 placeholder:text-slate-400"
                            />

                            <div className="rounded-2xl border border-[#e8dfd0] bg-white p-4">
                                <p className="mb-3 text-sm font-medium text-[#4e4434]">
                                    Allowed Units
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {PRICING_UNITS.map((unit) => (
                                        <label
                                            key={unit}
                                            className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${units.includes(unit)
                                                ? "border-[#2f2618] bg-[#2f2618] text-white"
                                                : "border-[#d8d0bf] bg-[#fcfaf5] text-[#5f5343]"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={units.includes(unit)}
                                                onChange={() => {
                                                    if (units.includes(unit)) {
                                                        setUnits(units.filter((u) => u !== unit));
                                                    } else {
                                                        setUnits([...units, unit]);
                                                    }
                                                }}
                                            />
                                            {unit}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-[#cfc4ae] bg-white text-[#4e4434] hover:bg-[#f5efe3]"
                                    onClick={() => {
                                        resetForm();
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    className="rounded-full bg-[#2f2618] px-5 text-white hover:bg-[#211a11]"
                                    disabled={
                                        createMutation.isPending ||
                                        updateMutation.isPending
                                    }
                                >
                                    {editing ? "Update Category" : "Create Category"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
