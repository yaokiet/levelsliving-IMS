export interface Supplier {
    id: number;
    name: string;
    description?: string;
    email?: string;
    contact_number?: string;
}

export const mockSuppliers: Supplier[] = [
    {
        id: 1,
        name: "Richard Martin",
        description: "Confectionery supplier specializing in Kit Kat products",
        email: "richard@gmail.com",
        contact_number: "7687764556"
    },
    {
        id: 2,
        name: "Tom Homan",
        description: "Beverage supplier for Maaza and related products",
        email: "tomhoman@gmail.com",
        contact_number: "9867545368"
    },
    {
        id: 3,
        name: "Veandir",
        description: "Dairy and chocolate products supplier",
        email: "veandier@gmail.com",
        contact_number: "9867545566"
    },
    {
        id: 4,
        name: "Charin",
        description: "Fresh produce supplier specializing in vegetables",
        email: "charin@gmail.com",
        contact_number: "9267545457"
    },
    {
        id: 5,
        name: "Hoffman",
        description: "Bakery and biscuit products supplier",
        email: "hoffman@gmail.com",
        contact_number: "9367546531"
    },
    {
        id: 6,
        name: "Fainden Juke",
        description: "Premium biscuit and cookies supplier",
        email: "fainden@gmail.com",
        contact_number: "9667545982"
    },
    {
        id: 7,
        name: "Martin",
        description: "Cooking oil and edible oil products supplier",
        email: "martin@gmail.com",
        contact_number: "9867545457"
    },
    {
        id: 8,
        name: "Joe Nike",
        description: "Biscuits and snack products supplier",
        email: "joenike@gmail.com",
        contact_number: "9567545769"
    },
    {
        id: 9,
        name: "Dender Luke",
        description: "Fresh fruits and organic produce supplier",
        email: "dender@gmail.com",
        contact_number: "9667545980"
    },
    {
        id: 10,
        name: "Global Supplies Inc",
        description: "Office equipment and business supplies",
        email: "contact@globalsupplies.com",
        contact_number: "6512345678"
    }
];
