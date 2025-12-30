import { Sparkles } from 'lucide-react';

const Header = () => {
    return (
        <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-zinc-400" />
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
                    Life OS
                </h1>
            </div>
            <p className="text-zinc-500 text-sm">
                Tu sistema de gestión personal
            </p>
        </header>
    );
};

export default Header;
