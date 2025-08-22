import { UIIconPaths } from '../assets/icons'

const Header = () => (
    <header className="flex items-center gap-3 p-4">
        <img src={UIIconPaths.plant} alt="Plant Icon" className="h-8 w-8" />
        <h1 className="text-2xl font-bold text-text-main">
            Watering Dashboard
        </h1>
    </header>
)

export default Header
