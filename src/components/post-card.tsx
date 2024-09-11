interface PostCardProps{
    title: string
    smalldescription: string
    firstname: string | undefined
    lastname: string | undefined
    createdAt: Date
    profilepicture: string | undefined | null
}

export default function PostCard({title, smalldescription, firstname, lastname, createdAt}: PostCardProps) {
  console.log(firstname, lastname)
  return (
    <div className="border">
      <div className="min-h-min p-3">
        <p className="mt-4 flex-1 text-base font-semibold text-gray-900">
          {title}
        </p>
        <p className="mt-4 w-full text-sm leading-normal line-clamp-2 text-gray-600">
          {smalldescription}
        </p>
        <div className="mt-4 flex space-x-3 ">
          <div>
            <p className="text-sm font-semibold leading-tight text-gray-900">
              {firstname} {lastname}
            </p>
            <p className="text-sm leading-tight text-gray-600">
            {new Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
              }).format(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
