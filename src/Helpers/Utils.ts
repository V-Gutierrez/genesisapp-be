export const generateSlug = (str: string) => str.replace(/\s+/g, '-').toLowerCase()

export const sanitizeUserPhone = (phone: string) => phone.replace(/\s/gi, '').replace('-', '')
