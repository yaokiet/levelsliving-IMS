export interface Supplier {
    id: number;
    supplierName: string;
    product: string;
    contactNumber: string;
    email: string;
    type: string;
    onTheWay: string | number;
    address?: string;
    registrationDate?: string;
    status?: string;
}

export const mockSuppliers: Supplier[] = [
    {
        id: 1,
        supplierName: "Richard Martin",
        product: "Kit Kat",
        contactNumber: "7687764556",
        email: "richard@gmail.com",
        type: "Taking Return",
        onTheWay: "13",
        address: "123 Supply Street, Singapore 123456",
        registrationDate: "2024-01-15",
        status: "Active"
    },
    {
        id: 2,
        supplierName: "Tom Homan",
        product: "Maaza",
        contactNumber: "9867545368",
        email: "tomhoman@gmail.com",
        type: "Taking Return",
        onTheWay: "-",
        address: "456 Commerce Ave, Singapore 234567",
        registrationDate: "2024-02-20",
        status: "Active"
    },
    {
        id: 3,
        supplierName: "Veandir",
        product: "Dairy Milk",
        contactNumber: "9867545566",
        email: "veandier@gmail.com",
        type: "Not Taking Return",
        onTheWay: "-",
        address: "789 Trade Blvd, Singapore 345678",
        registrationDate: "2024-03-10",
        status: "Active"
    },
    {
        id: 4,
        supplierName: "Charin",
        product: "Tomato",
        contactNumber: "9267545457",
        email: "charin@gmail.com",
        type: "Taking Return",
        onTheWay: "12",
        address: "321 Vendor Lane, Singapore 456789",
        registrationDate: "2024-01-25",
        status: "Active"
    },
    {
        id: 5,
        supplierName: "Hoffman",
        product: "Milk Bikis",
        contactNumber: "9367546531",
        email: "hoffman@gmail.com",
        type: "Taking Return",
        onTheWay: "-",
        address: "654 Business Park, Singapore 567890",
        registrationDate: "2024-04-05",
        status: "Inactive"
    },
    {
        id: 6,
        supplierName: "Fainden Juke",
        product: "Marie Gold",
        contactNumber: "9667545982",
        email: "fainden@gmail.com",
        type: "Not Taking Return",
        onTheWay: "9",
        address: "987 Industrial Ave, Singapore 678901",
        registrationDate: "2024-02-14",
        status: "Active"
    },
    {
        id: 7,
        supplierName: "Martin",
        product: "Saffola",
        contactNumber: "9867545457",
        email: "martin@gmail.com",
        type: "Taking Return",
        onTheWay: "-",
        address: "147 Supply Chain St, Singapore 789012",
        registrationDate: "2024-03-20",
        status: "Active"
    },
    {
        id: 8,
        supplierName: "Joe Nike",
        product: "Good day",
        contactNumber: "9567545769",
        email: "joenike@gmail.com",
        type: "Taking Return",
        onTheWay: "-",
        address: "258 Distribution Way, Singapore 890123",
        registrationDate: "2024-01-30",
        status: "Active"
    },
    {
        id: 9,
        supplierName: "Dender Luke",
        product: "Apple",
        contactNumber: "9667545980",
        email: "dender@gmail.com",
        type: "Not Taking Return",
        onTheWay: "7",
        address: "369 Wholesale Rd, Singapore 901234",
        registrationDate: "2024-04-12",
        status: "Active"
    },
    {
        id: 10,
        supplierName: "Global Supplies Inc",
        product: "Office Equipment",
        contactNumber: "6512345678",
        email: "contact@globalsupplies.com",
        type: "Taking Return",
        onTheWay: "25",
        address: "500 Corporate Plaza, Singapore 012345",
        registrationDate: "2024-01-01",
        status: "Active"
    }
];
