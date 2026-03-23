import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { categories } = await request.json();

  if (!Array.isArray(categories)) {
    return NextResponse.json({ error: 'Formato invalido' }, { status: 400 });
  }

  const profile = await prisma.user.update({
    where: { supabaseId: user.id },
    data: { favoriteCategories: categories },
  });

  return NextResponse.json({
    favoriteCategories: profile.favoriteCategories,
  });
}
