import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function MessageModal({ isOpen, onClose, messages, loading, onMarkAsRead }) {
    const getMessageTypeColor = (type) => {
        switch(type) {
            case 'application_accepted':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'application_rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getMessageTypeLabel = (type) => {
        switch(type) {
            case 'application_accepted':
                return 'Application Accepted';
            case 'application_rejected':
                return 'Application Rejected';
            default:
                return 'General Message';
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                                        Messages
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            <p className="mt-2 text-gray-500">Loading messages...</p>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-8">
                                            <EnvelopeIcon className="h-12 w-12 mx-auto text-gray-400" />
                                            <p className="mt-2 text-gray-500">No messages yet</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                onClick={() => !message.is_read && onMarkAsRead(message.id)}
                                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                                    !message.is_read 
                                                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                                        : 'bg-white border-gray-200 hover:shadow-sm'
                                                } ${getMessageTypeColor(message.type)}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMessageTypeColor(message.type)}`}>
                                                            {getMessageTypeLabel(message.type)}
                                                        </span>
                                                        {!message.is_read && (
                                                            <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-2">{message.message}</p>
                                                {message.admin && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        From: {message.admin.name}
                                                    </p>
                                                )}
                                                {message.application && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Regarding: Job Application
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}