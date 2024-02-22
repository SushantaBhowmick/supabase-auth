"use server"

const { createServerComponentClient } = require("@supabase/auth-helpers-nextjs");
const { revalidatePath } = require("next/cache");
const { cookies } = require("next/headers");

export async function deleteWatch(formData){
    const watchId = formData.get('id')

    const cookieStore=cookies();
    const supabase = createServerComponentClient({cookies:()=>cookieStore})
    const{data:{session}}=await supabase.auth.getSession();
    const user = session?.user;

    if(!user){
        console.error('Please login to access this resource')
        return
    }
    const {data,error}= await supabase
    .from('watches')
    .delete()
    .match({id:watchId,user_id:user.id})
    
    if(error){
        console.error('Error deleting data',error)
        return;
    }
    revalidatePath('/watch-list')
    return {message:'Success'}
}