class EventService {
//   constructor() {
//     // Initialize any necessary properties or API endpoints
//     this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
//   }

  /**
   * Fetch all events
   * @returns {Promise<Array>} Array of event objects
   */
  async getEvents() {
    try {
      // Mock data for now
      return [
        { start: 2001.00, end: 2002.00, date: "June 2001", title: "title", description: "description" },
        { start: 2005.00, end: 2010.00, date: "2005 - 2010", title: "Another Event", description: "This is another event description." },
        { start: 2001.00, end: 2003.00, date: "2001 - 2003", title: "Third Event", description: "Details about the third event go here." },
        { start: 1995.00, end: 2007.00, date: "1995 - 2007", title: "Long Event", description: "Information about the fourth event." },
        { start: 1950.00, end: 1951.00, date: "1950 - 1951", title: "Old Event", description: "Description of the old event." }
      ];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
}

const eventService = new EventService();
export default eventService;
