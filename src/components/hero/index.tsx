// components
import Logo from "./Logo";
import TypeWriterOutput from "@/components/TypeWriterOutput";

export default function Hero() {
  return (
    <article className="mx-auto max-w-[1200px] bg-white">
      <div className="from-background h-3 bg-linear-to-b to-white" />
      <Logo />
      <br />
      <TypeWriterOutput fullText="Are you tired of losing your brilliant ideas in a mess of digital notes? Do you find yourself endlessly searching for that one crucial piece of information you know you wrote down? Welcome to Total Recall AI, the next generation of personal knowledge management. This isn't just another note-taking app; it's your personal cognitive assistant, powered by the latest AI technology. Instead of hunting through folders and tags, imagine simply asking a question. Our AI has total recall of every note you've ever written, instantly finding and synthesizing the exact information you need. Whether you're a student preparing for an exam, a professional brainstorming a project, or just someone who wants to remember where they parked their car, Total Recall AI is ready to help you rediscover your own thoughts. Stop searching and start remembering. Total Recall AI makes sure your knowledge is never lost—it's just waiting for you to recall it." />
      <div className="to-background h-3 bg-linear-to-b from-white" />
    </article>
  );
}
