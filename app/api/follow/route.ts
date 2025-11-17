import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { followerId, followingId } = body;

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "followerId e followingId são obrigatórios" },
        { status: 400 }
      );
    }

    const followerIdNum = parseInt(followerId);
    const followingIdNum = parseInt(followingId);

    if (isNaN(followerIdNum) || isNaN(followingIdNum)) {
      return NextResponse.json(
        { error: "IDs inválidos" },
        { status: 400 }
      );
    }

    // Impedir follow para si mesmo
    if (followerIdNum === followingIdNum) {
      return NextResponse.json(
        { error: "Não é possível seguir a si mesmo" },
        { status: 400 }
      );
    }

    // Verificar se os usuários existem
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { id: followerIdNum } }),
      prisma.user.findUnique({ where: { id: followingIdNum } }),
    ]);

    if (!follower || !following) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Criar relação de follow
    await prisma.user.update({
      where: { id: followerIdNum },
      data: {
        following: {
          connect: { id: followingIdNum },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao criar follow:", error);
    // Verificar se é erro de relação duplicada
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "Relação de follow já existe" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar follow" },
      { status: 500 }
    );
  }
}
