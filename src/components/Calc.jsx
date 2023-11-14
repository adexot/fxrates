import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useDebounce } from "use-debounce";

const platforms = [
    {
        id: 'send',
        name: 'Send',
        avatar:
            'images/send.png',
    },
    {
        id: 'grey',
        name: 'Grey',
        avatar:
            'images/grey.png',
    },
    {
        id: 'transferGo',
        name: 'TransferGo',
        avatar:
            'images/transfergo.png',
    },
]

const currencies = [
    {
        id: 'usd',
        name: 'USD($) - US Dollar',
    },
    {
        id: 'eur',
        name: 'EUR(€) - Euro',
    },
    {
        id: 'gbp',
        name: 'GBP(£) - British Pound',
    },
]

const defaultRates = {
    send: {
        usd: 3,
        eur: 4,
        gbp: 5,
    },
    grey: {
        usd: 3,
        eur: 4,
        gbp: 5,
    },
    transferGo: {
        usd: 3,
        eur: 4,
        gbp: 5,
    },
}



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function ListBoxComponent({ items, label, selected, setSelected }) {
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-normal leading-6 text-gray-900">
                        {label}
                    </Listbox.Label>
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-sm bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                                {selected.avatar && (
                                    <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                )}
                                <span className="ml-3 block truncate">{selected.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <img src='images/arrow.svg' alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {items.map((item) => (
                                    <Listbox.Option
                                        key={item.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {item.avatar && (
                                                        <img src={item.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                    )}
                                                    <span
                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

function currencyFormat(amount) {
    const options = {
        maximumFractionDigits: 2,
    };
    const currencyValue = new Intl.NumberFormat('en-US', options).format(amount);
    return currencyValue;
}

export default function Converter({ rates = defaultRates }) {
    const [platform, setPlatform] = useState(platforms[0])
    const [currency, setCurrency] = useState(currencies[0])
    const [inputValue, setInputValue] = useState(0);
    const [debouncedValue] = useDebounce(inputValue, 100);
    const conversionRate = rates[platform.id][currency.id] ?? 0;
    const amount = debouncedValue * conversionRate;

    const handleInputChange = (e) => {
        let { value, maxLength } = e.target;
        console.log({ value, maxLength })
        if (String(value).length >= maxLength) {
            value = Number(value.slice(0, maxLength));
        }
        setInputValue(value);
    };

    return (
        <section className="mx-auto max-w-3xl px-2 mt-16 text-center">
            <h3 className="text-xl font-medium text-gray-800 max-w-2xl">
                Currency Converter for USD, GBP & EUR
            </h3>
            <p className="text-lg mx-auto mt-4">
                We use the mid-market rate for our Converter. This is for informational
                purposes only. You won’t receive this rate when sending /receive money.
                The live Nigerian Naira exchange rate (NGN) as of 4 Nov 2023 at 7:59 AM.
                Rates refresh in 59s
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 sm:grid-cols-10 text-left">
                <div className="sm:col-span-3">
                    <ListBoxComponent
                        items={currencies}
                        label='Currency'
                        setSelected={setCurrency}
                        selected={currency}
                    />
                </div>

                <div className="sm:col-span-4">
                    <label
                        htmlFor="last-name"
                        className="block text-sm font-normal leading-6 text-gray-900"
                    >Your preferred amount</label
                    >
                    <div className="mt-2">
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            min={0}
                            maxLength={8}
                            autoComplete="famount"
                            className="block w-full rounded-sm border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Enter an amount e.g $3,423.12"
                            onChange={handleInputChange}
                            value={debouncedValue}
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <ListBoxComponent
                        items={platforms}
                        label='Platform'
                        setSelected={setPlatform}
                        selected={platform}
                    />
                </div>
            </div>

            <div className="bg-green-50 mt-16 p-8 rounded-lg">
                <p className="text-sm text-gray-500">Currency Converter Result</p>
                <div className="my-16">
                    <span className="text-5xl font-semibold block mb-2">₦ {currencyFormat(amount)}</span>
                    <span className="block text-md">NGN(₦) - Nigerian Naira</span>
                </div>
                <p className="text-sm text-gray-700">
                    1.00 {currency.name} = {rates[platform.id][currency.id]} NGN (₦) - Nigerian Naira
                </p>
                <p className="text-sm text-gray-700">
                    1.00 NGN(₦) - Nigerian Naira = {(1 / conversionRate).toFixed(8)} {currency.name}
                </p>
            </div>
        </section>
    );
}
