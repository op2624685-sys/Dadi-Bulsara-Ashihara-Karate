import { UserForm } from "@/components/UserForm"

const page = () => {
  return (
    <>
      <div className="w-full max-w-md p-8 border rounded-lg shadow-sm bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
        <UserForm />
      </div>
    </>
  )
}

export default page
