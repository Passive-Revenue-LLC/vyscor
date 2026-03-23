import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  let profile = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!profile) {
    profile = await prisma.user.create({
      data: {
        supabaseId: user.id,
        email: user.email!,
        name: user.user_metadata?.name || null,
      },
    });
  }

  return NextResponse.json({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    favoriteCategories: profile.favoriteCategories,
  });
}
