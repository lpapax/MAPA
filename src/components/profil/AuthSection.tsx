'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Trash2, UserCircle2, Check, Pencil } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export function AuthSection() {
  const { user, signOut, deleteAccount } = useAuth()
  const { profile, updateDisplayName } = useProfile()
  const { show } = useToast()
  const router = useRouter()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!user) {
    return (
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5">
        <h2 className="font-heading font-semibold text-forest text-base mb-3">Účet</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Přihlaste se a synchronizujte oblíbené farmy, recenze a uložená hledání přes všechna zařízení.
        </p>
        <Link
          href="/prihlasit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          <UserCircle2 className="w-4 h-4" aria-hidden="true" />
          Přihlásit se
        </Link>
      </section>
    )
  }

  const displayName = profile?.display_name ?? user.email ?? ''
  const initials = displayName.charAt(0).toUpperCase()

  const startEditName = () => {
    setNameInput(profile?.display_name ?? '')
    setEditingName(true)
  }

  const saveName = async () => {
    if (!nameInput.trim()) return
    setSavingName(true)
    const { error } = await updateDisplayName(nameInput)
    setSavingName(false)
    if (error) {
      show(error, 'error')
    } else {
      show('Jméno uloženo', 'success')
      setEditingName(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    show('Odhlášení úspěšné', 'success')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    const { error } = await deleteAccount()
    setDeleting(false)
    if (error) {
      show(error, 'error')
    } else {
      router.push('/')
      show('Účet smazán', 'info')
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-4">
      <h2 className="font-heading font-semibold text-forest text-base">Účet</h2>

      {/* Avatar + email */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-forest truncate">{profile?.display_name ?? 'Bez jména'}</p>
          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Display name edit */}
      {editingName ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Vaše jméno"
            autoFocus
            maxLength={60}
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            onKeyDown={(e) => { if (e.key === 'Enter') saveName() }}
          />
          <button
            onClick={saveName}
            disabled={savingName || !nameInput.trim()}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl transition-colors cursor-pointer',
              'bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white',
            )}
            aria-label="Uložit jméno"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingName(false)}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            Zrušit
          </button>
        </div>
      ) : (
        <button
          onClick={startEditName}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-primary-600 transition-colors cursor-pointer"
        >
          <Pencil className="w-3 h-3" aria-hidden="true" />
          Upravit zobrazované jméno
        </button>
      )}

      {/* Logout + delete */}
      <div className="flex items-center gap-3 pt-1 border-t border-neutral-50">
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-forest transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          Odhlásit se
        </button>
        <div className="w-px h-4 bg-neutral-200" />
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500">Opravdu smazat?</span>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="text-xs text-red-600 font-semibold hover:text-red-700 cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Mažu…' : 'Ano, smazat'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              Zrušit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Smazat účet
          </button>
        )}
      </div>
    </section>
  )
}
