'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting and validation could be improved with Zod
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email et mot de passe requis' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!email || !password || !firstName || !lastName) {
        return { error: 'Tous les champs sont requis' }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // Sync with Prisma
        try {
            await prisma.user.create({
                data: {
                    id: data.user.id, // Use Supabase Auth ID as Prisma ID
                    email: email,
                    prenom: firstName,
                    nom: lastName,
                },
            })
        } catch (e) {
            console.error('Error creating user in Prisma:', e)
            // Optional: Delete user from Supabase if Prisma creation fails?
            // For now, we return an error but the Auth user exists.
            return { error: "Erreur lors de la création du profil utilisateur." }
        }
    } else {
        return { error: "Erreur lors de l'inscription (pas d'utilisateur créé)." }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
