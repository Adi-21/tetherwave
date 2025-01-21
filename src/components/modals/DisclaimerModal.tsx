import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const DisclaimerModal = ({ isOpen, onClose, onAccept }: DisclaimerModalProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleAccept = () => {
        if (isChecked) {
            onAccept();
            onClose();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                                >
                                    Financial Disclaimer
                                </Dialog.Title>
                                <div className="mt-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                                    <p>
                                        The information provided relates to the Tether Wave platform, which is a fully decentralized, blockchain-based smart contract program designed for crypto education and activity. It is not an investment program and does not guarantee any return on investment (ROI). The platform operates entirely on a 100% activity-based reward system.
                                    </p>
                                    <p>
                                        By using this platform, you acknowledge and agree to do so at your own risk. You accept all terms and conditions associated with this platform.
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => setIsChecked(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            I have read and agree to the terms and conditions
                                        </span>
                                    </label>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none
                                            ${isChecked
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-blue-400 cursor-not-allowed'}`}
                                        onClick={handleAccept}
                                        disabled={!isChecked}
                                    >
                                        Accept & Continue
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}; 