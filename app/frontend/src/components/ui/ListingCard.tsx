import { Listing } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Home, Bed, Ruler, Calendar, Phone, Euro, MapPin, Heart } from "lucide-react";

interface ListingCardProps {
    listing: Listing;
    highlight?: boolean;
    isFavorite?: boolean;
}

export default function ListingCard({ listing, highlight = false, isFavorite = false }: ListingCardProps) {
    return (
        <Card className={`mx-4 my-1 w-full max-w-lg overflow-hidden border shadow-md ${highlight ? "best-listing-card" : ""}`}>
            <CardHeader className="flex items-start justify-between p-4">
                <div className="flex items-center">
                    <CardTitle className="text-lg font-bold">{listing.title}</CardTitle>
                    <Heart className={`ml-2 cursor-pointer ${isFavorite ? "fill-current text-pink-500" : "text-gray-400"}`} />
                </div>
                <CardDescription className="mt-2">
                    <MapPin className="mr-2 inline-block text-gray-700" />
                    {listing.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Euro className="text-gray-700" />
                        <span className="font-semibold">Price:</span>
                        <span>€{listing.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Bed className="text-gray-700" />
                        <span className="font-semibold">Rooms:</span>
                        <span>{listing.rooms}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Ruler className="text-gray-700" />
                        <span className="font-semibold">Size:</span>
                        <span>{listing.size} m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Home className="text-gray-700" />
                        <span className="font-semibold">Floor:</span>
                        <span>{listing.floor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="text-gray-700" />
                        <span className="font-semibold">Availability:</span>
                        <span>{listing.availability}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4">
                <div className="flex items-center space-x-2">
                    <Phone className="text-gray-700" />
                    <span className="font-semibold">Contact:</span>
                    <span>{listing.contact}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
