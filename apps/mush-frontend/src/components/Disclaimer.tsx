const Disclaimer = () => {
  return (
    <section className='flex w-full max-w-prose flex-col items-center gap-3 px-1.5'>
      <h2 className='text-center'>Disclaimer</h2>
      <p className='rounded border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-orange-800/60'>
        <span className='font-bold'>⚠️ Important Note:</span> The identification results are for
        reference only. This tool may <span className='font-bold'>NOT</span> be accurate enough for
        <span className='font-bold'> deciding whether a mushroom is safe to eat</span>.
      </p>
      <p className='rounded border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-orange-500 dark:bg-orange-800/60'>
        {' '}
        ☠️ <span className='font-bold'>Safety Warning:</span> Never eat wild mushrooms based on this
        tool’s predictions. Eating unidentified mushrooms can be dangerous or even fatal. Always
        confirm with a qualified expert before consuming any mushroom.
        <br />
        <br />
        📢 <span className='font-bold'>Disclaimer:</span> This is an experimental machine learning
        project and results may be inaccurate in real-world use. This software is provided{' '}
        <i>“as is”</i>, without warranty of any kind. The developer assumes no responsibility for
        any consequences arising from its use.
      </p>
    </section>
  );
};

export default Disclaimer;
