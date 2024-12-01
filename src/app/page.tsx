import styles from "./page.module.scss";

interface NewsArticle {
  title: string;
  description: string;
  creator: string | null;
  link: string;
  pubDate: string; 
  source_name: string;
  source_icon: string | null; 
  image_url: string | null; 
}

// Function to truncate a string to a specified length
const truncateString = (str: string, num: number): string => {
  if (str.length > num) {
    return str.slice(0, num) + "..."; 
  }
  return str;
};

const apikey = process.env.API_KEY;

// Fetch articles from NewsData API
async function fetchBitcoinNews(): Promise<NewsArticle[]> {
  const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apikey}&q=bitcoin&language=en`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const jsonData = await res.json();

  // Process articles to map to NewsArticle interface
  const articles = jsonData.results.map((article: NewsArticle) => ({
    title: article.title || "No Title Available",
    description: article.description || "No Description Available",
    creator: article.creator || "Unknown",
    link: article.link,
    pubDate: article.pubDate, 
    source_name: article.source_name || "Unknown Source",
    source_icon: article.source_icon || null,
    image_url: article.image_url || null,
  }));

  return articles as NewsArticle[];
}

export default async function HomePage() {
  const newsArticles = await fetchBitcoinNews();

  return (
    <div className={styles.articleContainer}>
      <p>Your go-to source for the latest Bitcoin news.</p>
      <div className={styles.articles}>
        {newsArticles.length > 0 ? (
          newsArticles.map((article) => (
            <div key={article.link} className={styles.articleCard}>
              <h2>{article.title}</h2>
              <div className={styles.imagePlaceholder}>
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} width="1920" height="1080" />
                ) : (
                  <div className={styles.noImage}>No picture available.</div>
                )}
              </div>
              <p>{truncateString(article.description, 300)}</p>
              <h4>
                <strong>Author:</strong> <span>{article.creator}</span>
              </h4>
              <h4>
                <strong>Source:</strong> <span>{article.source_name}</span>
              </h4>
              <h4>
                <strong>Published:</strong>{" "}
                <span>{new Date(article.pubDate).toLocaleDateString()}</span>
              </h4>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))
        ) : (
          <p>No articles available at this time.</p>
        )}
      </div>
    </div>
  );
}

