"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { createCategory, reactivateCategory, updateCategory } from "@/src/services/catalog/category_service";
import { PricingUnit } from "@/src/types/catalog/category-enums";

export default function AdminCategoriesPage() {
    const router = useRouter();

    const { data, isLoading } = useCategories();

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deactivateMutation = useDeactivateCategory();
    const reactivateMutation = useReactivateCategory();
    const deleteCategory = useDeleteCategory()

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const PRICING_UNITS: PricingUnit[] = ["KG", "SQFT", "ITEMS"];
    const [units, setUnits] = useState<PricingUnit[]>([]);
    const categories = data ?? [];
    //reset
    const resetForm = () => {
        setName("");
        setDescription("");
        setUnits([]);
        setEditing(null);
    };

    //submit
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

    //columns
    const columns = [
        { key: "name", header: "Category Name" },

        {
            key: "description",
            header: "Description",
            render: (c: Category) => c.description || "-",
        },

        {
            key: "allowed_units",
            header: "Allowed Units",
            render: (c: Category) => c.allowed_units.join(", "),
        },

        {
            key: "is_active",
            header: "Status",
            render: (c: Category) =>
                c.is_active ? (
                    <span className="text-green-600 font-medium">
                        Active
                    </span>
                ) : (
                    <span className="text-gray-700 font-medium">
                        Inactive
                    </span>
                ),
        },

        {
            key: "actions",
            header: "Actions",
            render: (c: Category) => (
                <div className="flex gap-2">

                    {/* Edit */}
                    <Button
                        size="sm"
                        variant="outline"
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

                    {/* Delete */}
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            if (
                                confirm(
                                    `Are you sure you want to delete "${c.name}"?`
                                )
                            ) {
                                deleteCategory.mutate(c.id);
                            }
                        }}
                    >
                        Delete
                    </Button>

                    {/* Deactivate / Reactivate */}
                    {c.is_active ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                                deactivateMutation.mutate(c.id)
                            }
                        >
                            Deactivate
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                                reactivateMutation.mutate(c.id)
                            }
                        >
                            Reactivate
                        </Button>
                    )}

                </div>
            ),
        },
    ];
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        Categories Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage service categories
                    </p>
                </div>

                <Button
                    onClick={() => {
                        resetForm();
                        setOpen(true);
                    }}
                >
                    + Create Category
                </Button>
            </div>

            {/* Table */}
            <div className="mt-4">
                {isLoading ? (
                    <p className="text-sm text-gray-500">
                        Loading categories…
                    </p>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No categories found
                    </p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={categories}
                    />
                )}
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">

                        <h3 className="text-lg font-semibold mb-4">
                            {editing ? "Edit Category" : "Create Category"}
                        </h3>

                        <div className="space-y-4">
                            <Input
                                placeholder="Category name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                            <div>
                                <p className="text-sm font-medium mb-2">
                                    Allowed Units
                                </p>

                                <div className="flex gap-3">
                                    {PRICING_UNITS.map((unit) => (
                                        <label key={unit} className="flex items-center gap-1 text-sm">
                                            <input
                                                type="checkbox"
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
                                    onClick={() => {
                                        resetForm();
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        createMutation.isPending ||
                                        updateMutation.isPending
                                    }
                                >
                                    {editing
                                        ? "Update Category"
                                        : "Create Category"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}