import type { Route } from './+types/about'
import { Badge } from '@/components/ui/badge'

export function meta(_args: Route.MetaArgs) {
    return [
        { title: 'O Sprawnościach – Organizacja Harcerzy ZHR' },
        { name: 'description', content: 'Czym jest sprawność harcerska i jak ją zdobywać? Dowiedz się więcej o szlaku od jednej do trzech gwiazdek.' },
    ]
}

const CATEGORIES = [
    'Obozownictwo i przyroda',
    'Muzyka i ekspresja',
    'Sport, turystyka i krajoznawstwo',
    'Sztuka i technika',
    'Nauka i kultura',
    'Duch i charakter',
]

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12 animate-fade-in text-foreground">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-10 flex items-center gap-2 flex-wrap font-medium">
                <a href="/" className="hover:text-primary transition-colors py-2 px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                    Strona główna
                </a>
                <span className="text-muted-foreground/50" aria-hidden="true">›</span>
                <span className="text-foreground">O Sprawnościach</span>
            </nav>

            {/* Hero Quote */}
            <blockquote className="relative my-12 bg-muted/40 rounded-2xl p-8 sm:p-10 border border-border">
                {/* Decorative Quote Mark */}
                <span className="absolute -top-6 -left-2 text-6xl text-primary/30 font-serif leading-none select-none" aria-hidden>
                    "
                </span>
                <p className="text-xl sm:text-2xl font-serif text-foreground/90 leading-relaxed italic mb-4">
                    Druhu, druuuhuuuuu! Ja już umiem wszystko na „Tropiciela”!
                    <br /><br />
                    - Tak? Udowodnij!
                </p>
                <footer className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
                    ~ autor nieznany, czerwiec 2020 r.
                </footer>
            </blockquote>

            {/* Main Content */}
            <div className="space-y-12 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-3">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm" aria-hidden>?</span>
                        Czym jest sprawność?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-4">
                        Sprawność jest to wykazana praktycznie <strong className="text-foreground font-semibold">biegłość harcerza w określonej dziedzinie</strong> - to najkrótsza, a zarazem najlepsza definicja.
                    </p>
                    <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-lg">
                        <p className="text-foreground font-medium text-sm leading-relaxed">
                            Pamiętaj zatem, że aby ją zdobyć, nie wystarczy wiedzieć jak coś zrobić, trzeba to przede wszystkim umieć zrobić, a także potwierdzić tę umiejętność w praktyce przez realizację zadania. To nie może być też jednorazowy łut szczęścia czy sprzyjające okoliczności - zdobyta przez Ciebie sprawność oznacza, że <span className="text-primary underline underline-offset-4 font-bold">dane umiejętności posiadasz i jesteś w stanie zawsze z nich korzystać!</span>
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Ścieżki Umiejętności</h2>
                    <p className="text-muted-foreground mb-6">
                        Sprawności są powiązane w ścieżki umiejętności. Każda ścieżka rozpoczyna się sprawnością jednogwiazdkową (*), ale prowadzić może nawet do kilku sprawności trzygwiazdkowych (***). Ścieżki z kolei są uporządkowane w 6 działach:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {CATEGORIES.map(category => (
                            <div key={category} className="flex items-center gap-3 bg-muted/50 border rounded-xl p-4 transition-colors hover:bg-muted">
                                <Badge variant="outline" className="bg-background text-primary border-primary/20 shrink-0">Dział</Badge>
                                <span className="font-semibold text-sm">{category}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Jak Zdobywać?</h2>
                    <p className="text-muted-foreground mb-4">
                        Jeśli chcesz zdobywać sprawność wchodząc na jedną z opisanych w naszej bazie ścieżek - <strong className="text-foreground">zgłoś się do zastępowego</strong> (lub bezpośrednio do drużynowego) z prośbą o wyznaczenie zadań do wykonania.
                    </p>
                    <p className="text-muted-foreground mb-8">
                        Zdarzyć się też może, że wcześniej wykonałeś zadanie, które zawierało w sobie wymagania danej sprawności. Wówczas drużynowy ma prawo zaliczyć je na poczet próby na sprawność i dodać jedynie zadania wypełniające pozostałe wymagania, lub nawet przyznać sprawność od razu - jeśli uzna, że wymagania zostały spełnione w 100%.
                    </p>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-2">Wybieraj ambitnie!</h3>
                        <p className="text-sm text-card-foreground/80 leading-relaxed mb-0">
                            Wybieraj sprawności zgodnie z twoim harcerskim doświadczeniem i posiadanymi umiejętnościami. Pamiętaj - wymagania opisane w systemie nie są gotowymi zadaniami, <strong className="text-foreground">są wykazem umiejętności</strong>, które harcerz musi nabyć, aby zdobyć daną sprawność!
                        </p>
                    </div>
                </section>

                {/* Downloads */}
                <section className="pt-8 border-t mt-12">
                    <h2 className="text-xl font-bold tracking-tight mb-6 text-center">Materiały Źródłowe (Pobierz)</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://sprawnosci.zhr.pl/OHy_sprawnosci_ksiazeczka_2023.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Książeczka ZHR (Wydanie 2023)
                        </a>
                        <a
                            href="https://sprawnosci.zhr.pl/WODNIACY_sprawnosci_ksiazeczka_2024.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Sprawności Wodniackie (2024)
                        </a>
                    </div>
                </section>

            </div>
        </div>
    )
}
