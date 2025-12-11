import { useEffect, useState } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trophy, MapPin, Calendar, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyScore() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);

  // Load members list
  useEffect(() => {
    const loadMembers = async () => {
      const rec = await fetchRecords("members", "", "auto", "desc");
      const cleaned = rec.map((m) => ({
        id: m.id,
        name: m.fields.name,
        dept: m.fields.department,
        batch: m.fields.Batch,
      }));
      setMembers(cleaned);
    };

    loadMembers();
  }, []);

  const startSearch = async () => {
    const match = members.find(
      (m) => m.name.toLowerCase() === nameInput.trim().toLowerCase()
    );

    if (!match) {
      alert("Name not found in members table");
      return;
    }

    setMatchedUser(match);
    setSelectedUserId(match.id);
    loadScores(match.id);
  };

  const loadScores = async (userId) => {
    setLoading(true);

    const rec = await fetchRecords("Events", "", "auto", "desc");

    const participated = rec
      .map((ev) => {
        const { Coordinators = [], Volunteers = [], Attendees = [] } =
          ev.fields;

        let role = null;
        let points = 0;

        if (Coordinators.includes(userId)) {
          role = "Coordinator";
          points = ev.fields.Points_Coordinator || 0;
        } else if (Volunteers.includes(userId)) {
          role = "Volunteer";
          points = ev.fields.Points_Volunteer || 0;
        } else if (Attendees.includes(userId)) {
          role = "Attendee";
          points = ev.fields.Points_Attendee || 0;
        }

        if (!role) return null;

        return {
          id: ev.id,
          name: ev.fields.Name,
          date: ev.fields.Date,
          venue: ev.fields.Venue,
          image: ev.fields.Image ? ev.fields.Image[0].url : null,
          role,
          points,
        };
      })
      .filter(Boolean);

    setEvents(participated);
    setLoading(false);
  };

  const totalPoints = events.reduce((a, b) => a + b.points, 0);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-5 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <NavLink
            to="/"
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </NavLink>
          <h1 className="text-3xl font-bold">My Score</h1>
        </div>

        {/* Input Box */}
        {!selectedUserId && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <label className="text-gray-300 text-sm mb-2 block">
              Enter your name
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="Eg. Shamil"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button onClick={startSearch} className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        )}

        {/* Show profile info */}
        {matchedUser && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 flex items-center gap-4">
            <User size={42} className="text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold">{matchedUser.name}</h2>
              <p className="text-gray-400 text-sm">
                {matchedUser.dept} • {matchedUser.batch}
              </p>
            </div>
          </div>
        )}

        {/* Total Score */}
        {selectedUserId && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Points</p>
              <h2 className="text-4xl font-bold text-blue-400">{totalPoints}</h2>
            </div>
            <Trophy size={42} className="text-yellow-400" />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <Skeleton className="h-40 w-full mb-4 bg-gray-700" />
                <Skeleton className="h-6 w-1/2 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/3 bg-gray-700" />
              </div>
            ))}
          </div>
        ) : (
          selectedUserId &&
          (events.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Trophy size={42} className="mx-auto mb-4 text-gray-600" />
              <p>No event participation found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all"
                >
                  {ev.image && (
                    <img
                      src={ev.image}
                      className="w-full h-40 object-cover"
                      alt={ev.name}
                    />
                  )}

                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-1 line-clamp-1">
                      {ev.name}
                    </h2>

                    <div className="flex items-center text-sm text-gray-400 mb-1">
                      <Calendar size={15} className="mr-1" />
                      {formatDate(ev.date)}
                    </div>

                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <MapPin size={15} className="mr-1" />
                      {ev.venue}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          ev.role === "Coordinator"
                            ? "bg-blue-600"
                            : ev.role === "Volunteer"
                            ? "bg-purple-600"
                            : "bg-green-600"
                        }
                      >
                        {ev.role}
                      </Badge>

                      <Badge className="bg-yellow-500 text-black">
                        +{ev.points} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
