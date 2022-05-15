import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";


async function newVendor(companyName, companyEmail, companyCode, userEmail, userName) {
    //TODO: Need to validate schema here
    try {
        const newVend = await db.company.create({
            data: {
                name: companyName,
                email: companyEmail,
                companyCode: companyCode,
                users: {
                    create: {
                        email: userEmail,
                        name: userName,
                    },
                }
            },
        })
        return newVend;
    } catch (error) {
        console.log(error);
    }


    //console.log("response from prisma", newVend);

}

async function updateVendor(companyId) {
    const updated = await db.company.update({
        where: { id: companyId },
        data: { active: false }
    })

    console.log("Update Successful", updated);
}

export const loader = () => {
    return null;
}

export const action = async ({ request }) => {
    const form = await request.formData();
    const myaction = form.get("myaction");

    if (myaction == "AddCompany") {
        const companyName = form.get("companyName");
        const companyEmail = form.get("companyEmail");
        const companyCode = form.get("companyCode");
        const userName = form.get("name");
        const userEmail = form.get("email");
        if (typeof companyName !== "string") {
            return json({ formError: "Form not submitted correctly" }, { status: 400 })
        }
        if (companyCode.length != 3) {
            return json({ formError: "companyCode needs to be 3 digits long" }, { status: 400 })
        }

        // console.log("Submitting new vendor");
        // console.log("company Name", companyName);
        // console.log("company Email", companyEmail);
        // console.log("company Code", companyCode);
        // console.log("user name", userName);
        // console.log("user email", userEmail);
        const vend = await newVendor(companyName, companyEmail, companyCode, userEmail, userName);
        //console.log("response from action", vend);
        return redirect(`/vendors/${vend.companyCode}`);
    }


}

const Admin = () => {
    return (<div>
        <Form method="post">
            <input type="hidden" name="myaction" value="AddCompany" />
            <section class="text-gray-400 bg-gray-900 body-font relative">
                <div class="container px-5 py-24 mx-auto">
                    <div class="flex flex-col text-center w-full mb-12">
                        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Admin Page</h1>
                        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Create or Update Company Info</p>
                    </div>
                    <div class="lg:w-1/2 md:w-2/3 mx-auto">
                        <div class="flex flex-wrap -m-2">
                            <div class="p-2 w-full">
                                <div class="relative">
                                    <label for="companyName" class="leading-7 text-sm text-gray-400">Company Name</label>
                                    <input id="companyName" name="companyName" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 h-12 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required />
                                </div>
                            </div>
                            <div class="p-2 w-full">
                                <div class="relative">
                                    <label for="companyEmail" class="leading-7 text-sm text-gray-400">Company Email</label>
                                    <input id="companyEmail" name="companyEmail" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 h-12 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required />
                                </div>
                            </div>
                            <div class="p-2 w-full">
                                <div class="relative">
                                    <label for="companyCode" class="leading-7 text-sm text-gray-400">Company 3 Digit Code</label>
                                    <input id="companyCode" name="companyCode" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 h-12 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required />
                                </div>
                            </div>
                            <div class="flex flex-col text-center w-full mb-12">
                                <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Create a User with the company</p>
                            </div>
                            <div class="p-2 w-1/2">
                                <div class="relative">
                                    <label for="name" class="leading-7 text-sm text-gray-400">Name</label>
                                    <input required type="text" id="name" name="name" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div class="p-2 w-1/2">
                                <div class="relative">
                                    <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
                                    <input required type="email" id="email" name="email" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            {/* <div class="p-2 w-full">
                                <div class="relative">
                                    <label for="message" class="leading-7 text-sm text-gray-400">Message</label>
                                    <textarea id="message" name="message" class="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                </div>
                            </div> */}
                            <div class="p-2 w-full">
                                <button type="submit" class="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Form>
    </div>);
}

export default Admin;