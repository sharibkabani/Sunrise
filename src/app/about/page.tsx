"use client";

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
			<main className="flex-1 container mx-auto">
				<h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
				<div className="bg-card rounded-lg p-8 max-w-3xl mx-auto">
					<p className="text-lg mb-4">
						Welcome to Sunrise, a platform that encourages young people to learn
						about financial literacy through heavily curated courses and an
						interactive community.
					</p>
					<p className="text-lg mb-4">
						With the generous support of Sun Life, we’ve developed innovative
						solutions that address the unique financial challenges faced by our
                        future leaders. SunLife&apos;s expertise in financial services and 
                        commitment to community well-being have been invaluable in guiding our efforts.
					</p>
					<p className="text-lg mb-4">
						Our project aims to provide support through learning by application and 
                        interaction with mentors and peers. We hope to empower young people to 
                        make informed financial decisions and build a brighter future for themselves.
					</p>
					<p className="text-lg">
						We are excited to continue our journey and make a
						difference with the help of SunLife.
					</p>
				</div>
			</main>
		</div>
	);
}
