import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Layers, HardDrive, Cpu } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutStudio,
})

const PROFILES_INFO = [
  {
    name: 'Cherry Profile',
    height: '9.5mm',
    sculpted: 'Yes',
    shape: 'Cylindrical',
    description:
      'The community standard for ergonomics and optimal typing sound. Low profile and angled rows reduce finger travel stress.',
  },
  {
    name: 'OEM Profile',
    height: '11.9mm',
    sculpted: 'Yes',
    shape: 'Cylindrical',
    description:
      'Standard layout profile pre-installed on most prebuilt mechanical boards. Slightly taller angle relative to Cherry.',
  },
  {
    name: 'DSA Profile',
    height: '7.6mm',
    sculpted: 'No (Uniform)',
    shape: 'Spherical',
    description:
      'Uniform height across all rows. Spherical indentations hug the fingertips. Popular for split and non-traditional key layouts.',
  },
  {
    name: 'SA Profile',
    height: '16.5mm',
    sculpted: 'Yes (Extreme)',
    shape: 'Spherical',
    description:
      'Very tall, retro-inspired aesthetic with deep dish spherical tops. Emits a deep, hollow acoustic signature ("thock").',
  },
  {
    name: 'XDA Profile',
    height: '8.5mm',
    sculpted: 'No (Uniform)',
    shape: 'Spherical',
    description:
      'Uniform profile, slightly taller than DSA with a wider top surface area. Excellent for split keyboards and ortholinear layouts.',
  },
]

const PLASTICS_INFO = [
  {
    name: 'PBT (Polybutylene Terephthalate)',
    shineResistance: 95,
    texture: 'Crisp & Textured',
    durability: 'Extreme',
    soundPitch: 'Deep & Solid',
    description:
      'Resistant to oils from fingers; retains its matte finish over years of heavy use without developing a slippery shine.',
  },
  {
    name: 'ABS (Acrylonitrile Butadiene Styrene)',
    shineResistance: 40,
    texture: 'Smooth & Smooth-Satin',
    durability: 'Moderate',
    soundPitch: 'Bright & Sharp',
    description:
      'Allows for extremely vibrant colors and ultra-sharp legend lines through double-shot injection molding, but will polish to a shine over time.',
  },
]

function AboutStudio() {
  return (
    <main className="page-wrap px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="island-shell rounded-3xl p-8 sm:p-12 mb-10 text-center sm:text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-action)]/5 to-transparent rounded-bl-full pointer-events-none" />
        <span className="island-kicker mb-3">Knowledge Base & Anatomy</span>
        <h1 className="display-title mb-4 text-4xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          The Science of Custom Keycaps.
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--sea-ink-soft)]">
          CapForge Studio provides digital tools to sculpt, color, and customize
          key plates. The tactile feedback of physical keycaps depends on
          profile sculpts, material blends, and structural thickness. Review the
          specifications below to optimize your build specifications.
        </p>
      </motion.section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--color-action)]" />
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-[var(--sea-ink)]">
              Height Profiles Guide
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {PROFILES_INFO.map((profile) => (
              <div
                key={profile.name}
                className="island-shell rounded-xl p-5 border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[var(--sea-ink)] text-base">
                    {profile.name}
                  </h3>
                  <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-[var(--sea-ink-soft)] px-2 py-0.5 rounded border border-[var(--line)]">
                      Ht: {profile.height}
                    </span>
                    <span className="bg-[var(--color-ledger)] text-[var(--sea-ink)] px-2 py-0.5 rounded">
                      Sculpt: {profile.sculpted}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed m-0">
                  {profile.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[var(--color-action)]" />
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-[var(--sea-ink)]">
              Material Engineering (PBT vs ABS)
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {PLASTICS_INFO.map((material) => (
              <div
                key={material.name}
                className="island-shell rounded-xl p-6 border border-[var(--line)] bg-[var(--surface)]"
              >
                <h3 className="font-extrabold text-[var(--sea-ink)] text-base mb-3">
                  {material.name}
                </h3>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed mb-4">
                  {material.description}
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-1">
                      <span>Oil & Shine Resistance</span>
                      <span>{material.shineResistance}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-action)] transition-all duration-500"
                        style={{ width: `${material.shineResistance}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[var(--line)] text-center">
                    <div>
                      <span className="block text-[8px] font-black uppercase text-[var(--color-muted)]">
                        Surface Texture
                      </span>
                      <span className="text-[10px] font-bold text-[var(--sea-ink)]">
                        {material.texture}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black uppercase text-[var(--color-muted)]">
                        Durability
                      </span>
                      <span className="text-[10px] font-bold text-[var(--sea-ink)]">
                        {material.durability}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black uppercase text-[var(--color-muted)]">
                        Sound Profile
                      </span>
                      <span className="text-[10px] font-bold text-[var(--sea-ink)]">
                        {material.soundPitch}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 island-shell rounded-2xl p-6 text-center border-dashed bg-white/20">
        <Cpu className="h-6 w-6 text-[var(--color-action)] mx-auto mb-2" />
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--sea-ink)] mb-1">
          Dye-Sublimation vs. Double-Shot Injection
        </h3>
        <p className="text-xs text-[var(--sea-ink-soft)] max-w-2xl mx-auto leading-relaxed m-0">
          Double-shot legends are molded out of a secondary piece of plastic,
          guaranteeing they will never wear off. Dye-sublimation infuses dye
          directly into the plastic grains, yielding highly durable legends with
          continuous tone coverage.
        </p>
      </section>
    </main>
  )
}
