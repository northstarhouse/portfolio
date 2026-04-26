import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  reorderAdminProducts,
  updateAdminProduct
} from "@/lib/admin-data";
import { Product } from "@/lib/types";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/cart");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ products: await getAdminProducts() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product } = (await request.json()) as {
    product: Omit<Product, "id">;
  };

  await createAdminProduct(product);
  revalidateStorefront();
  return NextResponse.json({ products: await getAdminProducts() });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    product?: Product;
    ids?: string[];
  };

  if (payload.ids) {
    await reorderAdminProducts(payload.ids);
  } else if (payload.product) {
    await updateAdminProduct(payload.product);
  } else {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  revalidateStorefront();
  return NextResponse.json({ products: await getAdminProducts() });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteAdminProduct(id);
  revalidateStorefront();
  return NextResponse.json({ products: await getAdminProducts() });
}
