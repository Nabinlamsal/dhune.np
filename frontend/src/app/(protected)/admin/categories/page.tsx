"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { Input } from "@/src/components/ui/input";
import { CommissionSettingsCard } from "@/src/components/admin/CommissionSettingsCard";
import { ConfirmActionDialog } from "@/src/components/common/ConfirmActionDialog";

import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeactivateCategory,
    useDeleteCategory,
    useReactivateCategory,
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
    const [units, setUnits] = useState<PricingUnit[]>([]);
    const [confirmAction, setConfirmAction] = useState<{
        type: "deactivate" | "reactivate" | "delete";
        category: Category;
    } | null>(null);

    const PRICING_UNITS: PricingUnit[] = ["KG", "SQFT", "ITEMS"];
    const categories = data ?? [];

    const resetForm = () => {
        setName("");
        setDescription("");
        setUnits([]);
        setEditing(null);
    };

    const openCreateForm = () => {
        resetForm();
        setOpen(true);
    };

    const openEditForm = (category: Category) => {
        setEditing(category);
        setName(category.name);
        setDescription(category.description || "");
        setUnits(category.allowed_units);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        if (editing) {
            await updateMutation.mutateAsync({
                id: editing.id,
                name: name.trim(),
                description: description.trim(),
                allowed_units: units,
            });
        } else {
            await createMutation.mutateAsync({
                name: name.trim(),
                description: description.trim(),
                allowed_units: units,
            });
        }

        resetForm();
        setOpen(false);
    };

    const handleConfirmedAction = () => {
        if (!confirmAction) return;

        const { type, category } = confirmAction;
        const options = { onSuccess: () => setConfirmAction(null) };

        if (type === "deactivate") {
            deactivateMutation.mutate(category.id, options);
            return;
        }
        if (type === "reactivate") {
            reactivateMutation.mutate(category.id, options);
            return;
        }
        deleteCategory.mutate(category.id, options);
    };

    const columns = [
        {
            key: "name",
            header: "Category",
            render: (category: Category) => (
                <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.id}</div>
                </div>
            ),
        },
        {
            key: "description",
            header: "Description",
            render: (category: Category) => (
                <span className="text-sm text-gray-600">{category.description || "No description"}</span>
            ),
        },
        {
            key: "allowed_units",
            header: "Allowed Units",
            render: (category: Category) => (
                <div className="flex flex-wrap gap-2">
                    {category.allowed_units.map((unit) => (
                        <span
                            key={unit}
                            className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
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
            render: (category: Category) => (
                <span className={category.is_active ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-gray-500"}>
                    {category.is_active ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (category: Category) => (
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditForm(category)}>
                        Edit
                    </Button>
                    {category.is_active ? (
                        <Button size="sm" variant="secondary" onClick={() => setConfirmAction({ type: "deactivate", category })}>
                            Deactivate
                        </Button>
                    ) : (
                        <Button size="sm" variant="secondary" onClick={() => setConfirmAction({ type: "reactivate", category })}>
                            Reactivate
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setConfirmAction({ type: "delete", category })}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <CommissionSettingsCard />

            <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg">Category Management</CardTitle>
                    <Button onClick={openCreateForm}>
                        <Plus className="mr-2 size-4" />
                        Create Category
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-sm text-gray-500">No categories found.</p>
                    ) : (
                        <DataTable columns={columns} data={categories} />
                    )}
                </CardContent>
            </Card>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {editing ? "Edit Category" : "Create Category"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Category name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <Input
                                placeholder="Description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Allowed Units</p>
                                <div className="flex flex-wrap gap-3">
                                    {PRICING_UNITS.map((unit) => (
                                        <label key={unit} className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={units.includes(unit)}
                                                onChange={() => {
                                                    setUnits((current) =>
                                                        current.includes(unit)
                                                            ? current.filter((value) => value !== unit)
                                                            : [...current, unit]
                                                    );
                                                }}
                                            />
                                            {unit}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
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
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editing ? "Update Category" : "Create Category"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <ConfirmActionDialog
                open={!!confirmAction}
                title={
                    confirmAction?.type === "delete"
                        ? "Delete category?"
                        : confirmAction?.type === "deactivate"
                            ? "Deactivate category?"
                            : "Reactivate category?"
                }
                message={
                    confirmAction
                        ? `${confirmAction.type === "delete" ? "Delete" : confirmAction.type === "deactivate" ? "Deactivate" : "Reactivate"} "${confirmAction.category.name}"?`
                        : ""
                }
                confirmLabel={
                    confirmAction?.type === "delete"
                        ? "Delete"
                        : confirmAction?.type === "deactivate"
                            ? "Deactivate"
                            : "Reactivate"
                }
                tone={confirmAction?.type === "reactivate" ? "success" : "danger"}
                isLoading={deactivateMutation.isPending || reactivateMutation.isPending || deleteCategory.isPending}
                onCancel={() => setConfirmAction(null)}
                onConfirm={handleConfirmedAction}
            />
        </div>
    );
}
