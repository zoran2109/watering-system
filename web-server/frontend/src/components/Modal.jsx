import { useRef, useEffect } from 'react'

export default function Modal({ open, onClose, children }) {
    const modalRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-[#1f1f1f] text-white p-6 rounded-xl max-w-sm w-full relative shadow-lg border border-white/10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-red-400 text-lg cursor-pointer"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    )
}
