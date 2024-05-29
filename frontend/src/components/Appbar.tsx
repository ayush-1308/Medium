import { Avatar } from "./BlogCard"

const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <div className="font-bold">
        Medium
      </div>
      <div>
        <Avatar
         name="John Doe"
         size={6}
         />
      </div>
    </div>
  )
}

export default Appbar
