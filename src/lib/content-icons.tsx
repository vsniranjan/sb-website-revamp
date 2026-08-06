import type { ComponentType } from 'react'
import {
  Airplane,
  BookOpen,
  Code,
  Cpu,
  EnvelopeSimple,
  GraduationCap,
  Globe,
  HandHeart,
  MapPin,
  Microphone,
  Phone,
  Sparkle,
  UsersThree,
  type IconProps,
} from '@phosphor-icons/react'

/**
 * Kept out of content-helpers.tsx on purpose: @phosphor-icons/react calls
 * React.createContext at module scope for its IconContext provider, which
 * doesn't exist under Next's "react-server" condition. content-helpers.tsx is
 * imported by plain server components (TeamGrid, SocietiesGrid, …) for
 * icon-free helpers like accentByIndex — pulling Phosphor into that shared
 * file would crash every one of them. Only import this module from a
 * component that already has 'use client'.
 */

const EVENT_ICONS: Array<[RegExp, ComponentType<IconProps>]> = [
  [/hackathon/i, Code],
  [/speaker/i, Microphone],
  [/outreach/i, GraduationCap],
  [/women/i, UsersThree],
  [/humanitarian/i, HandHeart],
  [/technology/i, Cpu],
  [/upcoming/i, Sparkle],
]

export function eventIcon(tag: string): ComponentType<IconProps> {
  return EVENT_ICONS.find(([re]) => re.test(tag))?.[1] ?? Sparkle
}

const BENEFIT_ICONS: ComponentType<IconProps>[] = [Airplane, BookOpen, Globe]

export function benefitIcon(i: number): ComponentType<IconProps> {
  return BENEFIT_ICONS[i % BENEFIT_ICONS.length]
}

const CONTACT_ICONS: ComponentType<IconProps>[] = [MapPin, Phone, EnvelopeSimple]

export function contactIcon(i: number): ComponentType<IconProps> {
  return CONTACT_ICONS[i % CONTACT_ICONS.length]
}
