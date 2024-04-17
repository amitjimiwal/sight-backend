import bcrypt from 'bcryptjs';
//generating hass password to store in the daabase
export const generatehasspassword = async (
     password: string,
): Promise<string> => {
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
     return hashedPassword;
};

//comparing the password with the hashed password
export const comparepassword = async (
     password: string,
     hashedPassword: string,
): Promise<boolean> => {
     return await bcrypt.compare(password, hashedPassword);
};