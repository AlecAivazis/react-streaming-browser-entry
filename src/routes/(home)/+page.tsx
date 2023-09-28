import { isPending } from "$houdini";
import { PageProps } from "./$types";

export default function ({ ShowList }: PageProps) {
  return (
    <div className="flex flex-col gap-10">
      {ShowList.genres.edges.map(({ node: genre }, i) => (
        <div key={i} className="rounded-lg text-white pl-12">
          <h2 className="text-lg mb-4">
            {isPending(genre.name) ? (
              <div className="pulsate h-5 w-14" />
            ) : (
              genre.name
            )}
          </h2>
          <div className="flex flex-row gap-1">
            {genre.shows.edges.map(({ node }) => {
              if (isPending(node)) {
                return (
                  <a
                    href="#"
                    className="pulsate"
                    style={{ width: 233, height: 130 }}
                    key={i}
                  >
                    <div className="pulsate" />
                  </a>
                );
              }

              return (
                <a
                  href={`/shows/${node.id}`}
                  style={{ width: 233, height: 130 }}
                  key={node.name}
                >
                  <img src={node.billboard.source} />
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
