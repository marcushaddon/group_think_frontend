import { FunctionComponent } from "react";
import { Voter, Election } from "../../models";

const LINEBREAK = "%0D%0A";

const inviteFor = (poll: Election, p: Voter) => {
  const subject = `${poll.owner} wants you to vote on "${poll.name}"!}`;
  const origin = window.location.origin;
  const href = `${origin}/vote/${poll.id}?token=${p.token}`;
  const body = `Hi! ${poll.owner.name} wants your input! Click <a href=${href}>here</a> to vote.`;
  const bodyEncoded = body.split(/[\.\!]/g).join(LINEBREAK);

  return {
    subject,
    origin,
    href,
    body,
    bodyEncoded,
    email: p.email,
    participant: p,
    poll,
  };
};

// https://stackoverflow.com/questions/53003980/how-to-copy-a-hypertext-link-into-clipboard-without-losing-the-link-properties
// https://stackoverflow.com/questions/74838274/copy-html-rich-text-using-js-navigator-clipboard
const InviteButton: FunctionComponent<{
  invite: ReturnType<typeof inviteFor>;
  gmail?: boolean;
}> = ({
  invite: { participant, href, poll },
  gmail = false,
}) => {
  const invite = () => {
    const link =
      `Hi ${participant.name}! ${poll.owner.name} wants your input on <b>${poll.name}</b>` +
      "<br />".repeat(2) +
      `<a href="${href}">Click here to vote!</a>`;
    const plaintext =
      `Hi ${participant.name}! ${poll.owner.name} wants your input on ${poll.name}` +
      "\n".repeat(2) +
      href;

    const linkBlob = new Blob([link], { type: "text/html" });
    // TODO: could we have a separate link that causes fs to return a webpreview?
    const blobText = new Blob([plaintext], { type: "text/plain" });

    const item: ClipboardItem[] = [
      new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: linkBlob,
      }),
    ];
    navigator.clipboard.write(item);
    if (gmail) {
      const gmailComposeUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${participant.email}` +
        `&body=${encodeURIComponent('Highlight this text and hit "paste" to replace it with the invitation!')}`;
      window.open(gmailComposeUrl, "_blank");
    } else {
        alert(`Invite for ${participant.name} copied to clipboard!`);
    }
  };

  return (
    <button onClick={invite} className="border rounded-lg me-4 p-2">
      {gmail ? "Gmail" : "Copy invite to clipboard"}
    </button>
  );
};

const LinkButton: FunctionComponent<{
  invite: ReturnType<typeof inviteFor>;
}> = ({ invite }) => (
  <button
    className="border rounded-lg me-1 p-2"
    onClick={() => {
      window.open(invite.href, "_blank")?.focus();
    }}
  >
    Vote here
  </button>
);

export const InviteView: FunctionComponent<{ poll?: Election }> = ({
    poll
}) => {

  return !poll ? (
    <>fetching poll</>
  ) : (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Invites for {poll.name}</h1>
      <div className="space-y-6">
        {poll.voters.map((p) => {
          const invite = inviteFor(poll, p);
 
          return (
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="flex flex-row items-center">
                <InviteButton invite={invite} />
                <LinkButton invite={invite} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
